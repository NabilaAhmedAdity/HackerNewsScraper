const axios = require('axios');
const cheerio = require('cheerio');

class HackerNewsScraper {
  constructor(n) {
    let numberOfPosts = Number(n);

    if(!this._validateProp(numberOfPosts)) {
      throw 'Number of posts should be a positive integer <= 100';
    }
    this.numberOfPosts = numberOfPosts;
    this.URL = 'https://news.ycombinator.com';
  }

  _validateProp(numberOfPosts) {
    return !numberOfPosts || !Number.isInteger(numberOfPosts) || numberOfPosts<=0 || numberOfPosts>100 ? false : true;
  }

  async _getNumberOfPostsPerPage() {
    let response;

    try{
      response = await axios.get(this.URL);
    } catch(err) {
      throw `${err} while hitting URL: ${this.URL}`;
    }

    try {
      let html = cheerio.load(response.data);
      let postPerPage = html('.athing').length;
      return postPerPage;
    } catch(err) {
      throw err;
    }
  }

  async getTopPosts() {
    try {
      this.postsPerPage = await this._getNumberOfPostsPerPage();
    } catch(err) {
      throw err;
    }

    if(this.postsPerPage === 0) {
      throw `No posts found in HackerNews with url: ${this.URL}`;
    }

    let topPosts = [];
    return topPosts;
  }
}

module.exports.HackerNewsScraper = HackerNewsScraper;
