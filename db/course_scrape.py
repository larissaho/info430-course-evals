import pyodbc
import requests as r
from bs4 import BeautifulSoup as bs
import os 
import glob

# Connect to our database, and return our database connection
def connectToDB():
    print("Connecting to database")
    mydb = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=is-info430.ischool.uw.edu;DATABASE=Group2_Final;UID=INFO430;PWD=wubalubadubdub')
    print("Doneone connecting")
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
    @firstName = ?,
    @lastName = ?,
    @quarter = ?,
    @academicYear = ?,
    @numSurveyed = ?,
    @numEnrolled = ?,
    @courseAsWholeScore = ?,
    @courseContentScore = ?,
    @proContributionScore = ?,
    @proEffectivenessScore = ?
    """ 
    print("Starting import")

    for i in evalData:
        firstName = i[0]
        lastName = i[1]
        quarter = i[2]
        academicYear = i[3]
        numSurveyed =i[4]
        numEnrolled = i[5]
        courseAsWholeScore = i[6]
        courseContentScore = i[7]
        proContributionScore = i[8]
        proEffectivenessScore = i[9]

        params = (firstName, lastName, quarter, academicYear, numSurveyed, numEnrolled, courseAsWholeScore, courseContentScore, proContributionScore, proEffectivenessScore)

        print(i)

        cursor.execute(insertData, params)

    # Commits the transaction 
    cursor.commit()
    
    # Close the connection and cursor 
    cursor.close()
    databaseConnection.close()
    print("Import completed")

# Pulls out the needed content and appends them into lists
def scrapeContent(scrape, firstName, lastName, courseName, quarter, year, numSurveyed, numEnrolled,
    wholeMedian, contentMedian, contributionMedian, effectivenessMedian):
    # Get the section where the HTML content is
    content = scrape.select('body')

    # Extract basic course information 
    courseName.append(content[0].find('h1').text.split()[2] + content[0].find('h1').text.split()[3])
    courseInfo = content[0].find('h2').text.split()

    firstName.append(courseInfo[0])
    lastName.append(courseInfo[1])
    quarter.append(courseInfo[3][:2])
    year.append(courseInfo[3][-2:])

    # Extract course statistics 
    tableInfo = content[0].find('table')
    surveyStats = tableInfo.find('caption').text.split()

    numSurveyed.append(surveyStats[4])
    numEnrolled.append(surveyStats[6])

    # Extract course evaluation data 
    tableRows = tableInfo.select('tr')
    
    # Remove un-needed first row with headers
    tableRows.pop(0)

    wholeMedian.append(tableRows[0].select('td')[-1].text)
    contentMedian.append(tableRows[1].select('td')[-1].text)
    contributionMedian.append(tableRows[2].select('td')[-1].text)
    effectivenessMedian.append(tableRows[3].select('td')[-1].text)

if __name__ == '__main__':
    # Initalize empty lists
    firstName = []
    lastName = []
    courseName = []
    quarter = []
    year = []
    numSurveyed = []
    numEnrolled = []
    wholeMedian = []
    contentMedian = []
    contributionMedian = []
    effectivenessMedian = []

    path = '/Users/larissaho/Desktop/UW/INFO430/info430-course-evals/db/CEC'

    for fileName in glob.glob(os.path.join(path, '*.html')):
        print(fileName)
        scrape = getHTML(fileName)
        scrapeContent(scrape, firstName, lastName, courseName, quarter, year, numSurveyed, numEnrolled, wholeMedian, contentMedian, contributionMedian, effectivenessMedian)

    allValues = list(zip(firstName, lastName, courseName, quarter, year, numSurveyed, numEnrolled, wholeMedian, contentMedian, contributionMedian, effectivenessMedian))

    print(allValues)

    # Connect to the database 
    # databaseConnection = connectToDB()

    # Insert data into the SQL table 
    # insertEvals(allValues, databaseConnection)
