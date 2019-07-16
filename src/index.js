const { HackerNewsScraper } = require('hackerNewsScraper');

async function main() {
  try{
    let scraper = new HackerNewsScraper();
    let posts = await scraper.getTopPosts(100);
    console.log(posts);
  } catch(err) {
    console.log(err);
  }
}

main();
