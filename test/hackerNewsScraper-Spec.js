const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised)
const expect = chai.expect;
const nock = require('nock');
const sinon = require('sinon');
const { HackerNewsScraper } = require('../script/hackerNewsScraper');

describe('Test for HackerNewsScraper initialization', () => {
  it('should throw an error when scraper is initialized without any params', () => {
    expect(() => new HackerNewsScraper()).to.throw('Number of posts should be a positive integer <= 100'); 
  });

  it('should throw an error when scraper is initialized with a number > 100', () => {
    expect(() => new HackerNewsScraper(101)).to.throw('Number of posts should be a positive integer <= 100'); 
  });

  it('should throw an error when scraper is initialized with a 0', () => {
    expect(() => new HackerNewsScraper(0)).to.throw('Number of posts should be a positive integer <= 100'); 
  });

  it('should throw an error when scraper is initialized with a negative number', () => {
    expect(() => new HackerNewsScraper(-1)).to.throw('Number of posts should be a positive integer <= 100'); 
  });

  it('should throw an error when scraper is initialized with a floating number', () => {
    expect(() => new HackerNewsScraper(30.5)).to.throw('Number of posts should be a positive integer <= 100'); 
  });

  it('should throw an error when scraper is initialized with a invalid number', () => {
    expect(() => new HackerNewsScraper('23b3')).to.throw('Number of posts should be a positive integer <= 100'); 
  });

  it('should set the property correctly when initialize with valid string that can be converted into integer', () => {
    let scraper = new HackerNewsScraper(' 56');
    expect(scraper.numberOfPosts).to.eql(56)
  });

  it('should set the property correctly when initialize with valid integer', () => {
    let scraper = new HackerNewsScraper(09);
    expect(scraper.numberOfPosts).to.eql(9)
  });

  it('should set the URL correctly during initialization', () => {
    let scraper = new HackerNewsScraper(50);
    expect(scraper.URL).to.eql('https://news.ycombinator.com');
  });
});

describe('Test for API call', () => {
  it('should pass the error correctly when there is an error from server side', async () => {
    const scraper = new HackerNewsScraper(1);

    nock(scraper.URL)
      .get('/')
      .reply(500, null);
    await expect(scraper.getTopPosts()).to.be.rejectedWith(`Error: Request failed with status code 500 while hitting URL: ${scraper.URL}`);
  });

  it('should pass the error correctly when there is a 404 error', async () => {
    const scraper = new HackerNewsScraper(1);

    nock(scraper.URL)
      .get('/')
      .reply(404, null);
    await expect(scraper.getTopPosts()).to.be.rejectedWith(`Error: Request failed with status code 404 while hitting URL: ${scraper.URL}`);
  });

  it('should pass the error correctly when there is no posts', async () => {
    const dummyResponse = '<html></html>'
    const scraper = new HackerNewsScraper(1);

    nock(scraper.URL)
      .get('/')
      .reply(200, dummyResponse);
    await expect(scraper.getTopPosts()).to.be.rejectedWith(`No posts found in HackerNews with url: ${scraper.URL}`);
  });

  it('should calculate posts per page correctly', async () => {
    const dummyResponse = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">1.</span></td> <td class="title"><a href="https://www.bbc.co.uk/news/business-48962557" class="storylink">New face of the Bank of England £50 note is revealed</a></td> </tr> <tr> <td class="subtext"> <span class="score">14 points</span> by <a href="user?id=hanoz" class="hnuser">hanoz</a> <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">17 comment</a> </td> </tr> <tr class="spacer" style="height:5px"></tr> </tbody> </table> </body> </html>';
    const scraper = new HackerNewsScraper(1);

    nock(scraper.URL)
      .get('/')
      .reply(200, dummyResponse);
    nock(scraper.URL)
      .get('/news?p=1')
      .reply(200, dummyResponse);
    await scraper.getTopPosts();
    expect(scraper.postsPerPage).to.eql(1);
  });
});
