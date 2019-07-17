# HackerNewsScraper

### About
This is a command line tool which can extract top **N** valid posts from HackerNews in **JSON** format. Where **N** is a number given by user during running the command.

### Example
`$ hackernews -p 2`
```
[
    {
        "title": "Web Scraping in 2016",
        "uri": "https://franciskim.co/2016/08/24/dont-need-no-stinking-api-web-scraping-2016-beyond/",
        "author": "franciskim",
        "points": 133,
        "comments": 80,
        "rank": 1
    },
    {
        "title": "Instapaper is joining Pinterest",
        "uri": "http://blog.instapaper.com/post/149374303661",
        "author": "ropiku",
        "points": 182,
        "comments": 99,
        "rank": 2
    }
]
```

### Post Validity
A post is valid if the following constraints matched:
- title and author are non empty strings not longer than 256 characters.
- uri is a valid URI
- points, comments and rank are integers >= 0

### Installation guide
- Should have Node 8+ and npm already installed
- First download or cloned the project
- Go to the project directory
- Run `npm install -g`

### How to run?
In your terminal paste `hackernews -p 10`.
This 10 can be replaced by any positive integer less than equal to 100.

### Run test?
- Go to the project directory
- Run `npm test`
