import requests as r
import json
from bs4 import BeautifulSoup as bs
import math
import pandas as pd
import re
import pyodbc
from db_connection import * 

if __name__ == '__main__':
    schoolId = 1530 # University of Washington

    page = r.get(
        "https://www.ratemyprofessors.com/filter/professor/?&page=1&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=" + str(
        schoolId))
    temp_jsonpage = json.loads(page.content)
    num_of_prof = temp_jsonpage['remaining'] + 20
    num_of_pages = math.ceil(num_of_prof / 20) # 404 pages

    
    # Create list with professor info
    print('Gathering all UW professors...')
    i = 1
    professorList = []
    while (i <= num_of_pages): 
        page = r.get("https://www.ratemyprofessors.com/filter/professor/?&page=" + str(
            i) + "&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=" + str(
            schoolId))
        temp_jsonpage = json.loads(page.content)
        temp_list = temp_jsonpage['professors']
        professorList.extend(temp_list)
        i += 1

    # Filter to Info dept.
    professorInfo = pd.DataFrame(professorList)
    professorInfo = professorInfo[professorInfo['tDept'] == 'Information Science']

    print('Gathering top 3 ratings for INFO professors...')
    # Create list of 3 most recent ratings per professor
    ratings = []
    for index, row in professorInfo.iterrows():
        page = r.get("https://www.ratemyprofessors.com/paginate/professors/ratings?tid={0}&page=0&max=3&cache=false".format(row['tid']))
        temp_jsonpage = json.loads(page.content)
        temp_list = temp_jsonpage['ratings']
        for rating in temp_list:
            rating['tid'] = row['tid']
            rating['fName'] = row['tFname']
            rating['lName'] = row['tLname']

            # Check if course name exists
            if re.search(r'^[A-Za-z]+', rating['rClass']) is not None:
                rating['courseName'] = re.search(r'^[A-Za-z]+', rating['rClass'])[0]
            else:
                rating['courseName'] = 'N/A'

            # Check if course num exists
            if re.search(r'[0-9]+', rating['rClass']) is not None:
                rating['courseNum'] = re.search(r'[0-9]+', rating['rClass'])[0]
            else:
                rating['courseNum'] = 0

            ratings.append(rating)
        

    ratings = pd.DataFrame(ratings)
    ratings['courseNum'] = pd.to_numeric(ratings['courseNum'])
    ratings = ratings[['fName', 'lName', 'courseNum', 'courseName', 
       'rOverall', 'rComments']]

    ratings = ratings.values.tolist()
    print('Done')

    connectToDB()
    
    # insert data into our database
    insertRating = """
    SET NOCOUNT ON; 
    EXECUTE [dbo].[insertRatings]
    @firstName = ?, 
    @lastName = ?,
    @courseNumber = ?,
    @courseName = ?,
    @rating = ?,
    @comment = ?
    """

    print("Starting import...")

    for rating in ratings:
        cursor.execute(insertRating, rating)
    
    #commit your transaction when finished
    cursor.commit()
    #close the connection and cursor
    cursor.close()
    mydb.close()

    print("Import completed.")