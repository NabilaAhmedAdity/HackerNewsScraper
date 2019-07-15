const axios = require('axios');
const cheerio = require('cheerio');

class HackerNewsScraper {
  constructor(numberOfPosts) {
    if(!this._validateProp(numberOfPosts)) {
      throw 'Number of posts should be a positive integer <= 100';
    }
    this.numberOfPosts = numberOfPosts;
    this.URL = 'https://news.ycombinator.com';
  }

  _validateProp(numberOfPosts) {
    let n = Number(numberOfPosts);
    return !n || !Number.isInteger(n) || n<=0 || n>100 ? false : true;
  }
}

module.exports.HackerNewsScraper = HackerNewsScraper;
