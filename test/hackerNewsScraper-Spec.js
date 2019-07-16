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

  it('should initialize with empty posts list', () => {
    let scraper = new HackerNewsScraper(50);
    expect(scraper.topPosts.length).to.eql(0);
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

describe('Test for posts validity', () => {
  let scraper;

  beforeEach(() => {
    const dummyResponse1 = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">1.</span></td> <td class="title"><a href="https://www.bbc.co.uk/news/post-1" class="storylink">Post-1</a></td> </tr> <tr> <td class="subtext"> <span class="score">10 points</span> by <a href="user?id=hanoz" class="hnuser">Author-1</a> <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">5 comment</a> </td> </tr> <tr class="spacer" style="height:5px"></tr> </tbody> </table> </body> </html>';
    const dummyResponse3 = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">3.</span></td> <td class="title"><a href="https://www.bbc.co.uk/news/post-3" class="storylink">Post-3</a></td> </tr> <tr> <td class="subtext"> <span class="score">30 points</span> by <a href="user?id=hanoz" class="hnuser">Author-3</a> <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">15 comment</a> </td> </tr> <tr class="spacer" style="height:5px"></tr> </tbody> </table> </body> </html>';
    scraper = new HackerNewsScraper(2);

    nock(scraper.URL)
      .get('/')
      .reply(200, dummyResponse1);
    nock(scraper.URL)
      .get('/news?p=1')
      .reply(200, dummyResponse1);
    nock(scraper.URL)
      .get('/news?p=3')
      .reply(200, dummyResponse3);
  });

  it('should get the top two posts corectly', async () => {
    const dummyResponse2 = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">2.</span></td> <td class="title"><a href="https://www.bbc.co.uk/news/post-2" class="storylink">Post-2</a></td> </tr> <tr> <td class="subtext"> <span class="score">20 points</span> by <a href="user?id=hanoz" class="hnuser">Author-2</a> <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">10 comment</a> </td> </tr> <tr class="spacer" style="height:5px"></tr> </tbody> </table> </body> </html>';
    nock(scraper.URL)
      .get('/news?p=2')
      .reply(200, dummyResponse2);

    let posts = await scraper.getTopPosts();
    expect(posts).to.eql([
      {
        title: 'Post-1',
        uri: 'https://www.bbc.co.uk/news/post-1',
        author: 'Author-1',
        rank: 1,
        points: 10,
        comments: 5
      },
      {
        title: 'Post-2',
        uri: 'https://www.bbc.co.uk/news/post-2',
        author: 'Author-2',
        rank: 2,
        points: 20,
        comments: 10
      }
    ]);
  });

  it('should ignore any post with empty title', async () => {
    let dummyResponse2 = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">2.</span></td> <td class="title"><a href="https://www.bbc.co.uk/news/post-2" class="storylink"></a></td> </tr> <tr> <td class="subtext"> <span class="score">20 points</span> by <a href="user?id=hanoz" class="hnuser">Author-2</a> <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">10 comment</a> </td> </tr> <tr class="spacer" style="height:5px"></tr> </tbody> </table> </body> </html>';
    nock(scraper.URL)
      .get('/news?p=2')
      .reply(200, dummyResponse2);

    let posts = await scraper.getTopPosts();
    expect(posts).to.eql([
      {
        title: 'Post-1',
        uri: 'https://www.bbc.co.uk/news/post-1',
        author: 'Author-1',
        rank: 1,
        points: 10,
        comments: 5
      },
      {
        title: 'Post-3',
        uri: 'https://www.bbc.co.uk/news/post-3',
        author: 'Author-3',
        rank: 3,
        points: 30,
        comments: 15
      }
    ]);
  });

  it('should ignore any post with no author', async () => {
    const dummyResponse2 = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">2.</span></td> <td class="title"><a href="https://www.bbc.co.uk/news/post-2" class="storylink">Post-2</a></td> </tr> <tr> <td class="subtext"> <span class="score">20 points</span> by <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">10 comment</a> </td> </tr> <tr class="spacer" style="height:5px"></tr> </tbody> </table> </body> </html>';
    nock(scraper.URL)
      .get('/news?p=2')
      .reply(200, dummyResponse2);

    let posts = await scraper.getTopPosts();
    expect(posts).to.eql([
      {
        title: 'Post-1',
        uri: 'https://www.bbc.co.uk/news/post-1',
        author: 'Author-1',
        rank: 1,
        points: 10,
        comments: 5
      },
      {
        title: 'Post-3',
        uri: 'https://www.bbc.co.uk/news/post-3',
        author: 'Author-3',
        rank: 3,
        points: 30,
        comments: 15
      }
    ]);
  });

  it('should ignore any post with invalid uri', async () => {
    const dummyResponse2 = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">2.</span></td> <td class="title"><a href="Looks like an url" class="storylink">Post-2</a></td> </tr> <tr> <td class="subtext"> <span class="score">20 points</span> by <a href="user?id=hanoz" class="hnuser">Author-2</a> <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">10 comment</a> </td> </tr> <tr class="spacer" style="height:5px"></tr> </tbody> </table> </body> </html>';
    nock(scraper.URL)
      .get('/news?p=2')
      .reply(200, dummyResponse2);

    let posts = await scraper.getTopPosts();
    expect(posts).to.eql([
      {
        title: 'Post-1',
        uri: 'https://www.bbc.co.uk/news/post-1',
        author: 'Author-1',
        rank: 1,
        points: 10,
        comments: 5
      },
      {
        title: 'Post-3',
        uri: 'https://www.bbc.co.uk/news/post-3',
        author: 'Author-3',
        rank: 3,
        points: 30,
        comments: 15
      }
    ]);
  });

  it('should ignore any post with floating points', async () => {
    const dummyResponse2 = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">2.</span></td> <td class="title"><a href="https://www.bbc.co.uk/news/post-2" class="storylink">Post-2</a></td> </tr> <tr> <td class="subtext"> <span class="score">20.7 points</span> by <a href="user?id=hanoz" class="hnuser">Author-2</a> <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">10 comment</a> </td> </tr> <tr class="spacer" style="height:5px"></tr> </tbody> </table> </body> </html>';
    nock(scraper.URL)
      .get('/news?p=2')
      .reply(200, dummyResponse2);

    let posts = await scraper.getTopPosts();
    expect(posts).to.eql([
      {
        title: 'Post-1',
        uri: 'https://www.bbc.co.uk/news/post-1',
        author: 'Author-1',
        rank: 1,
        points: 10,
        comments: 5
      },
      {
        title: 'Post-3',
        uri: 'https://www.bbc.co.uk/news/post-3',
        author: 'Author-3',
        rank: 3,
        points: 30,
        comments: 15
      }
    ]);
  });

  it('should ignore any post with negative rank', async () => {
    const dummyResponse2 = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">-2.</span></td> <td class="title"><a href="https://www.bbc.co.uk/news/post-2" class="storylink">Post-2</a></td> </tr> <tr> <td class="subtext"> <span class="score">20 points</span> by <a href="user?id=hanoz" class="hnuser">Author-2</a> <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">10 comment</a> </td> </tr> <tr class="spacer" style="height:5px"></tr> </tbody> </table> </body> </html>';
    nock(scraper.URL)
      .get('/news?p=2')
      .reply(200, dummyResponse2);

    let posts = await scraper.getTopPosts();
    expect(posts).to.eql([
      {
        title: 'Post-1',
        uri: 'https://www.bbc.co.uk/news/post-1',
        author: 'Author-1',
        rank: 1,
        points: 10,
        comments: 5
      },
      {
        title: 'Post-3',
        uri: 'https://www.bbc.co.uk/news/post-3',
        author: 'Author-3',
        rank: 3,
        points: 30,
        comments: 15
      }
    ]);
  });

  it('should ignore any post with invalid integer comment', async () => {
    const dummyResponse2 = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">2.</span></td> <td class="title"><a href="https://www.bbc.co.uk/news/post-2" class="storylink">Post-2</a></td> </tr> <tr> <td class="subtext"> <span class="score">20 points</span> by <a href="user?id=hanoz" class="hnuser">Author-2</a> <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">10c comment</a> </td> </tr> <tr class="spacer" style="height:5px"></tr> </tbody> </table> </body> </html>';
    nock(scraper.URL)
      .get('/news?p=2')
      .reply(200, dummyResponse2);

    let posts = await scraper.getTopPosts();
    expect(posts).to.eql([
      {
        title: 'Post-1',
        uri: 'https://www.bbc.co.uk/news/post-1',
        author: 'Author-1',
        rank: 1,
        points: 10,
        comments: 5
      },
      {
        title: 'Post-3',
        uri: 'https://www.bbc.co.uk/news/post-3',
        author: 'Author-3',
        rank: 3,
        points: 30,
        comments: 15
      }
    ]);
  });

  it('should throw an error if number of valid posts in not enough', async () => {
    const dummyResponse2 = '<html> <body> <table id="hnmain"> <tbody> <tr class="athing"> <td class="title"><span class="rank">2.</span></td> <td class="title"><a href="https://www.bbc.co.uk/news/post-2" class="storylink">Post-2</a></td> </tr> <tr> <td class="subtext"> <span class="score">20 points</span> by <a href="user?id=hanoz" class="hnuser">Author-2</a> <span class="age"><a href="item?id=20439425">27 minutes ago</a></span> <span id="unv_20439425"></span> | <a href="hide?id=20439425&goto=news">hide</a> | <a href="item?id=20439425">10c comment</a> </td> </tr> <tr class="spacer" style="height:5px"></tr> </tbody> </table> </body> </html>';
    const dummyResponse4 = '<html></html>'
    nock(scraper.URL)
      .get('/news?p=2')
      .reply(200, dummyResponse2);
    nock(scraper.URL)
      .get('/news?p=4')
      .reply(200, dummyResponse4);

    scraper.numberOfPosts = 3;
    await expect(scraper.getTopPosts()).to.be.rejectedWith('Not enough valid posts. Total valid posts found 2, required 3');
  });
});
