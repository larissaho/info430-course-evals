import pyodbc
import requests as r
from bs4 import BeautifulSoup as bs
import os 
import glob

# Connect to our database, and return our database connection
def connectToDB():
    print("Connecting to database")
    mydb = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=is-info430.ischool.uw.edu;DATABASE=Group2_Final;UID=INFO430;PWD=wubalubadubdub')
    print("Done connecting")
    return mydb

# Take in the string of a web address, and retun HTML elements of the page
def getHTML(domain):
    page = open(domain, "rb").read()
    return bs(page, 'html.parser')

# Executes the stored procedure to insert the data from the site
def insertEvals(evalData, databaseConnection):
    cursor = databaseConnection.cursor()

    insertData = """
    SET NOCOUNT ON; 
    EXECUTE insertEvals
    @courseNumber = ?,
    @courseName = ?,
    @firstName = ?,
    @lastName = ?,
    @quarter = ?,
    @year = ?,
    @numSurveyed = ?,
    @numEnrolled = ?,
    @courseAsWholeScore = ?,
    @courseContentScore = ?,
    @proContributionScore = ?,
    @proEffectivenessScore = ?
    """ 
    print("Starting import")

    for i in evalData:
        courseNumber = i[0]
        courseName = i[1]
        firstName = i[3]
        lastName = i[4]
        quarter = i[2]
        year = i[5]
        numSurveyed =i[6]
        numEnrolled = i[7]
        courseAsWholeScore = i[8]
        courseContentScore = i[9]
        proContributionScore = i[10]
        proEffectivenessScore = i[11]

        params = (courseNumber, courseName, firstName, lastName, quarter, year, numSurveyed, numEnrolled, courseAsWholeScore, courseContentScore, proContributionScore, proEffectivenessScore)

        print(i)

        cursor.execute(insertData, params)

    # Commits the transaction 
    cursor.commit()
    
    # Close the connection and cursor 
    cursor.close()
    databaseConnection.close()
    print("Import completed")

# Pulls out the needed content and appends them into lists
def scrapeContent(scrape, courseNumber, courseName, quarter, firstName, lastName, year, numSurveyed, numEnrolled,
    courseAsWholeScore, courseContentScore, proContributionScore, proEffectivenessScore):
    # Get the section where the HTML content is
    content = scrape.select('body')

    # Extract basic course information 
    courseName.append(content[0].find('h1').text.split()[2])
    courseNumber.append(int(content[0].find('h1').text.split()[3]))
    courseInfo = content[0].find('h2').text.split()

    firstName.append(courseInfo[0])
    lastName.append(courseInfo[1])
    quarter.append(courseInfo[len(courseInfo) - 1][:2])
    year.append(int(courseInfo[len(courseInfo) - 1][-2:]))

    # Extract course statistics 
    tableInfo = content[0].find('table')
    surveyStats = tableInfo.find('caption').text.split()
    numSurveyed.append(int(surveyStats[4].replace('"', '').strip('\"')))
    numEnrolled.append(int(surveyStats[6].replace('"', '').strip('\"')))

    # Extract course evaluation data 
    tableRows = tableInfo.select('tr')
    
    # Remove un-needed first row with headers
    tableRows.pop(0)

    courseAsWholeScore.append(float(tableRows[0].select('td')[-1].text))
    courseContentScore.append(float(tableRows[1].select('td')[-1].text))
    proContributionScore.append(float(tableRows[2].select('td')[-1].text))
    proEffectivenessScore.append(float(tableRows[3].select('td')[-1].text))

if __name__ == '__main__':
    # Initalize empty lists
    courseNumber = []
    courseName = []
    firstName = []
    lastName = []
    quarter = []
    year = []
    numSurveyed = []
    numEnrolled = []
    courseAsWholeScore = []
    courseContentScore = []
    proContributionScore = []
    proEffectivenessScore = []

    path = '/Users/larissaho/Desktop/CEC'

    for fileName in glob.glob(os.path.join(path, '*.html')):
        print(fileName)
        scrape = getHTML(fileName)
        scrapeContent(scrape, courseNumber, courseName, firstName, lastName, quarter, year, numSurveyed, numEnrolled, courseAsWholeScore, courseContentScore, proContributionScore, proEffectivenessScore)

    allValues = list(zip(courseNumber, courseName, firstName, lastName, quarter, year, numSurveyed, numEnrolled, courseAsWholeScore, courseContentScore, proContributionScore, proEffectivenessScore))

    # Connect to the database 
    databaseConnection = connectToDB()

    # Insert data into the SQL table 
    insertEvals(allValues, databaseConnection)