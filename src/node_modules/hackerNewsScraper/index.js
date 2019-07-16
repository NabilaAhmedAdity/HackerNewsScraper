const axios = require('axios');
const cheerio = require('cheerio');
const validUrl = require('valid-url');

class HackerNewsScraper {
  constructor(n) {
    let numberOfPosts = Number(n);

    if(!this._isValidateProp(numberOfPosts)) {
      throw 'Number of posts should be a positive integer <= 100';
    }
    this.numberOfPosts = numberOfPosts;
    this.URL = 'https://news.ycombinator.com';
    this.topPosts = [];
  }

  _isPositiveInteger(value) {
    return !Number.isInteger(value) || value<=0 ? false : true;
  }

  _isNonNegativeInteger(value) {
    return !Number.isInteger(value) || value<0 ? false : true;
  }

  _isValidString(value) {
    return !value || value.length <= 0 || value.length > 256 ? false : true;
  }

  _isValidateProp(numberOfPosts) {
    return !this._isPositiveInteger(numberOfPosts) || numberOfPosts>100 ? false : true;
  }

  async _getNumberOfPostsPerPage() {
    let response;

    try{
      response = await axios.get(this.URL);
    } catch(err) {
      throw `${err} while hitting URL: ${this.URL}`;
    }

    try {
      let $ = cheerio.load(response.data);
      let postPerPage = $('.athing').length;
      return postPerPage;
    } catch(err) {
      throw err;
    }
  }

  _isValidPost(post) {
    return !this._isValidString(post.title) || !this._isValidString(post.author) ||
            !validUrl.isUri(post.uri) || !this._isNonNegativeInteger(post.rank) ||
            !this._isNonNegativeInteger(post.points) || !this._isNonNegativeInteger(post.comments) ? false : true;
  }

  // This function takes a HTML page, parse the posts one by one until it reaches the limit(numberOfPosts).
  // Then check if the post is valid or not
  // If a post is valid, add it to the topPosts list
  _parseHtml(html) {
    try {
      let $ = cheerio.load(html);
      let titleRows = $('.athing');

      if(!titleRows.length) {
        throw `Not enough valid posts. Total valid posts found ${this.topPosts.length}, required ${this.numberOfPosts}`;
      }

      for(let i=0; i<titleRows.length; i++) {
        if(this.topPosts.length === this.numberOfPosts) {
          break;
        }

        let titleRow = titleRows[i];
        let subtextRow = $(titleRow).next();
        // First row contains title, uri and rank
        // Second row contains points, author and comments
        let post = {
          title: $(titleRow).find('.storylink').text(),
          uri: $(titleRow).find('.storylink').attr('href'),
          author: $(subtextRow).find('.hnuser').text(),
          rank: Number($(titleRow).find('.rank').text().slice(0, -1)),
          points: Number($(subtextRow).find('.score').text().split(' ')[0]),
          comments: Number($(subtextRow).find('.subtext').children().last().text().slice(0, -8)),
        }

        if(this._isValidPost(post)) {
          this.topPosts.push(post);
        }
      }
    }
    catch(err) {
      throw err;
    }
  }

  async _getTopPosts() {
    let page = 0;

    while(this.topPosts.length < this.numberOfPosts) {
      page++;
      try {
        let response = await axios.get(`${this.URL}/news?p=${page}`);
        this._parseHtml(response.data);
      } catch(err) {
        throw err;
      }
    }
  }

  // This function returns the top N valid posts from Hacker News, where N is set during initiazing the instance
  async getTopPosts() {
    try {
      this.postsPerPage = await this._getNumberOfPostsPerPage();
    } catch(err) {
      throw err;
    }

    if(this.postsPerPage === 0) {
      throw `No posts found in HackerNews with url: ${this.URL}`;
    }

    try {
      await this._getTopPosts();
      return this.topPosts;
    } catch(err) {
      throw err;
    }
  }
}

module.exports.HackerNewsScraper = HackerNewsScraper;
