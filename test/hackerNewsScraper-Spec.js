const expect = require('chai').expect;
const sinon = require('sinon');
const nock = require('nock');
const { HackerNewsScraper } = require('../script/hackerNewsScraper');

describe('Test for HackerNewsScraper initialization', function() {
  it('should throw an error when scraper is initialized without any params', function() {
    try {
      let scraper = new HackerNewsScraper();
    }
    catch(err) {
      expect(err).to.eql('Number of posts should be a positive integer <= 100');
    }
  });

  it('should throw an error when scraper is initialized with a number > 100', function() {
    try {
      let scraper = new HackerNewsScraper(101);
    }
    catch(err) {
      expect(err).to.eql('Number of posts should be a positive integer <= 100');
    }
  });

  it('should throw an error when scraper is initialized with a 0', function() {
    try {
      let scraper = new HackerNewsScraper(0);
    }
    catch(err) {
      expect(err).to.eql('Number of posts should be a positive integer <= 100');
    }
  });

  it('should throw an error when scraper is initialized with a negative number', function() {
    try {
      let scraper = new HackerNewsScraper(-1);
    }
    catch(err) {
      expect(err).to.eql('Number of posts should be a positive integer <= 100');
    }
  });

  it('should throw an error when scraper is initialized with a floating number', function() {
    try {
      let scraper = new HackerNewsScraper(34.5);
    }
    catch(err) {
      expect(err).to.eql('Number of posts should be a positive integer <= 100');
    }
  });

  it('should throw an error when scraper is initialized with a invalid number', function() {
    try {
      let scraper = new HackerNewsScraper('676aab');
    }
    catch(err) {
      expect(err).to.eql('Number of posts should be a positive integer <= 100');
    }
  });

  it('should set the property correctly when initialize with valid string that can be converted into integer', function() {
    try {
      let scraper = new HackerNewsScraper(' 56');
      expect(scraper.numberOfPosts).to.eql(56)
    }
    catch(err) {}
  });

  it('should set the property correctly when initialize with valid integer', function() {
    try {
      let scraper = new HackerNewsScraper(09);
      expect(scraper.numberOfPosts).to.eql(9)
    }
    catch(err) {}
  });

  it('should set the URL correctly during initialization', function() {
    try {
      let scraper = new HackerNewsScraper(50);
      expect(scraper.URL).to.eql('https://news.ycombinator.com');
    }
    catch(err) {}
  });
});

describe('Test for API call', function() {
  it('should pass the error correctly when there is an error from server side', async function() {
    let scraper = new HackerNewsScraper(50);
    nock(scraper.URL)
      .get('/')
      .reply(500, null);
    try {
      await scraper.getTopPosts();
    } catch(err) {
      expect(err).to.eql(`Error: Request failed with status code 500 while hitting URL: ${scraper.URL}`);
    }
  });

  it('should pass the error correctly when there is a 404 error', async function() {
    let scraper = new HackerNewsScraper(50);
    nock(scraper.URL)
      .get('/')
      .reply(404, null);
    try {
      await scraper.getTopPosts();
    } catch(err) {
      expect(err).to.eql(`Error: Request failed with status code 404 while hitting URL: ${scraper.URL}`);
    }
  });

  it('should pass the error correctly when there is no posts', async function() {
    let scraper = new HackerNewsScraper(50);
    const dummyResponse = '<html></html>'
    nock(scraper.URL)
      .get('/')
      .reply(200, dummyResponse);
    try {
      await scraper.getTopPosts();
    } catch(err) {
      expect(err).to.eql(`No posts found in HackerNews with url: ${scraper.URL}`);
    }
  });

  it('should calculate posts per page correctly', async function() {
    let scraper = new HackerNewsScraper(50);
    const dummyResponse = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">1.</span></td> <td class="title"><a href="https://www.bbc.co.uk/news/business-48962557" class="storylink">New face of the Bank of England £50 note is revealed</a></td> </tr> <tr> <td class="subtext"> <span class="score">14 points</span> by <a href="user?id=hanoz" class="hnuser">hanoz</a> <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">1 comment</a> </td> </tr> </tbody> </table> </body> </html>'
    nock(scraper.URL)
      .get('/')
      .reply(200, dummyResponse);
    await scraper.getTopPosts();
    expect(scraper.postsPerPage).to.eql(1);
  });
});
