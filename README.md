# HackerNewsScraper

## About
This is a command line tool which can extract top **N** valid posts from HackerNews in **JSON** format. Where **N** is a number given by user when running the command.

### Example
``` bash
# Run command-line to get top 2 valid posts
$ hackernews -p 2

[
    {
        "title": "Web Scraping in 2016",
        "uri": "https://franciskim.co/2016/08/24/dont-need-no-stinking-api-web-scraping-2016-beyond/",
        "author": "franciskim",
        "rank": 1,
        "points": 133,
        "comments": 80
    },
    {
        "title": "Instapaper is joining Pinterest",
        "uri": "http://blog.instapaper.com/post/149374303661",
        "author": "ropiku",
        "rank": 2,
        "points": 182,
        "comments": 99
    }
]


# Run test
$ npm test

> hackernewsscraper@1.0.0 test /Users/nabila/Desktop/HackerNewsScraper
> mocha src/**/*-Spec.js


  Initialization test
    ✓ should set the URL correctly during initialization

  Test for valid parameters in getTopPosts
    ✓ should throw an error when calling the function without any parameters
    ✓ should throw an error when calling the function with a number > 100
    ✓ should throw an error when calling the function with a 0
    ✓ should throw an error when calling the function with a negative number
    ✓ should throw an error when calling the function with a floating number
    ✓ should throw an error when calling the function with a invalid number

  Test for API call
(node:25557) [DEP0066] DeprecationWarning: OutgoingMessage.prototype._headers is deprecated
    ✓ should pass the error correctly when there is an error from server side
    ✓ should pass the error correctly when there is a 404 error

  Test for posts validity
    ✓ should get the top two posts correctly
    ✓ should ignore any post with empty title
    ✓ should ignore any post with no author
    ✓ should ignore any post with invalid uri
    ✓ should ignore any post with floating points
    ✓ should ignore any post with negative rank
    ✓ should ignore any post with invalid integer comment
    ✓ should throw an error if number of valid posts in not enough


  17 passing (146ms)
```

### Post Validity
A post is valid if the following constraints matched:
- title and author are non empty strings not longer than 256 characters.
- uri is a valid URI
- points, comments and rank are integers >= 0

## Installation
### Without Docker
``` bash
# Pre-requisite
# You need Node8+ and npm
# More details https://nodejs.org/en/download

# Fetch the code base
$ git clone git@github.com:NabilaAhmedAdity/HackerNewsScraper.git

# Move to project directory
$ cd HackerNewsScraper

# Install command-line tool
$ npm install -g

# Run command-line
# Where 10 can be replaced by any positive integer less than equal to 100
$ hackernews -p 10
```

### With Docker

```bash
# Pre-requisite
# You need Docker and Docker-Compose
# More details https://docs.docker.com/compose/install

# Fetch the code base
$ git clone git@github.com:NabilaAhmedAdity/HackerNewsScraper.git

# Move to project directory
$ cd HackerNewsScraper

# Install and run docker container
$ docker-compose run hacker-news-scraper

# Run command-line
# Where 10 can be replaced by any positive integer less than equal to 100
$ hackernews -p 10
```

## Used libraries
- **axios** for making HTTP request and to get the response as promise.
- **mocha** is my testing framework.
- **chai** is an assertion library that goes perfectly with mocha.
- **chai-as-promised** extends chai to test promises easily.
- **chalk** is used to color texts in terminal. I used green color for informations and red for errors.
- **cheerio** is used to parse HTML DOM. It provides an API for traversing/manipulating the resulting data structure just like JQuery.
- **commander** is used to take input from terminal. It helps us to parse process.argv in much easy and better way. 
- **nock** is used to make fake API responses during testing. So that I can run my tests in isolation.
- **valid-url** is a npm module to validate url.
