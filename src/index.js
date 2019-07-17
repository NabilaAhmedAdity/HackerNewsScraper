#!/usr/bin/env node
const { HackerNewsScraper } = require('hackerNewsScraper');
const program = require('commander');
const chalk = require('chalk');

async function main() {
  program
  .version('0.1.0', '-v, --version')
  .option('-p, --posts <posts>', 'Number of valid posts to extract')
  .parse(process.argv);
  
  if(!program.posts) {
    console.log(chalk.green('Should run with -p flag. Example: hackernews -p 10'));
    return;
  }

  try{
    let scraper = new HackerNewsScraper();
    let posts = await scraper.getTopPosts(program.posts);
    console.log(posts);
  } catch(err) {
    console.log(chalk.red(err));
  }
}

main();
