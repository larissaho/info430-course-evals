import pyodbc
import requests as r
from bs4 import BeautifulSoup as bs

import urllib.request
import sys

from lxml import html

# def getHTML(domain):
#     frontPage = r.get(domain, auth=('USER_NAME', 'PASSWORD'))
#     return bs(frontPage.content, 'html.parser')

if __name__ == '__main__':

    # Start the session 
    session_requests = r.session()

    # Account data 
    login_data = {
        'j_username' : '****', #FILL IN UWNET ID USERNAME 
        'j_password' : '****!' #FILL IN UWNET ID PASSWORD
    }

    # Sign into the site with the account data
    loginUrl = 'https://idp.u.washington.edu/idp/profile/SAML2/POST/SSO;jsessionid=7E0DB174EB9927C8F34EB6FBE6F5F826.idp07?execution=e1s1'
    post = session_requests.post(
        loginUrl,
        data = login_data
    )

    # Access the site using the login data from the step before 
    url = 'https://www.washington.edu/cec/'
    result = session_requests.get(
        url
    )

    print(result.content)

    # Call to scrape the given website domain
    # domain = 'https://www.washington.edu/cec/i/INFO200B1560.html'
    # scrapeContent = getHTML(domain)

    # content = scrapeContent.select('body')

    # print(content)

    
