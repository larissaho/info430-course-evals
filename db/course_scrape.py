import pyodbc
import requests as r
from bs4 import BeautifulSoup as bs

# Take in the string of a web address, and retun HTML elements of the page
def getHTML(domain):
    page = open(domain, "rb").read()
    return bs(page, 'html.parser')

if __name__ == '__main__':

    # Call to scrape the given website domain 
    domain = '/Users/larissaho/Desktop/UW/INFO430/info430-course-evals/db/test_course_page.html'
    scrape = getHTML(domain)

    # Get the section where the HTML content is
    content = scrape.select('body')

    # Extract basic course information 
    courseName = content[0].find('h1').text.split()[2] + content[0].find('h1').text.split()[3]

    courseInfo = content[0].find('h2').text.split()

    firstName = courseInfo[0]
    lastName = courseInfo[1]
    quarter = courseInfo[3][:2]
    year = courseInfo[3][:-4]

    # Extract course statistics 
    tableInfo = content[0].find('table')
    surveyStats = tableInfo.find('caption').text.split()

    numSurveyed = surveyStats[4]
    numEnrolled = surveyStats[6]

    # Extract course evaluation data 
    evalInfo = tableInfo.find('tbody')
    print(evalInfo)

    
