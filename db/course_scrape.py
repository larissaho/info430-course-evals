import pyodbc
import requests as r
from bs4 import BeautifulSoup as bs

from lxml import html

# def getHTML(domain):
#     frontPage = r.get(domain, auth=('USER_NAME', 'PASSWORD'))
#     return bs(frontPage.content, 'html.parser')

if __name__ == '__main__':
    # with open('/Users/larissaho/Desktop/test.html', "rb") as f:
    #     page = f.read()

    # print(html.fromstring(page))

    a = open('/Users/larissaho/Desktop/UW/INFO430/info430-course-evals/db/test_course_page.html', "rb").read()

    bs = bs(a, 'html.parser')

    values = bs.select('body')

    test = values[0].find('h2').text

    table = values[0].find('table')

    print(test)
    print(table)

    # print(values)

    
