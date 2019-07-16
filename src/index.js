const { HackerNewsScraper } = require('hackerNewsScraper');

async function main() {
  try{
    let scraper = new HackerNewsScraper(100);
    let posts = await scraper.getTopPosts();
    console.log(posts);
  } catch(err) {
    console.log(err);
  }
}

main();
