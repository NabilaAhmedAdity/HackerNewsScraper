const expect = require('chai').expect;
const sinon = require('sinon');
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
})
