import pyodbc
import requests as r
from bs4 import BeautifulSoup as bs

import mechanize
import urllib3
import http.cookiejar as cookielib

# def getHTML(domain):
#     frontPage = r.get(domain, auth=('USER_NAME', 'PASSWORD'))
#     return bs(frontPage.content, 'html.parser')

if __name__ == '__main__':
    # Call to scrape the given website domain
    # domain = 'https://www.washington.edu/cec/i/INFO200B1560.html'
    # scrapeContent = getHTML(domain)

    # content = scrapeContent.select('body')

    # print(content)

    cook = cookielib.CookieJar()
    req = mechanize.Browser()
    req.set_cookiejar(cook)

    req.open("https://www.washington.edu/cec/i/INFO200B1560.html")

    req.select_form(nr=0)
    req.form['username'] = 'username'
    req.form['password'] = 'password.'
    req.submit()

    print(req.response().read())
    
