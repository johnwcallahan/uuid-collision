'use-strict';

var collisionFinder = require('./lib/collisionFinder');

var commander = require('commander');
var path = require('path');

// Parse command line arguments
commander
  .option('-p, --path <path>', 'Path to search')
  .option('-e, --extension <extension>', 'Limit search to file type')
  .parse(process.argv);

// Use current working directory if none specified
var dir = commander.directory
  ? path.resolve(commander.directory)
  : process.cwd();

// Use wild card if no extension specified
var ext = commander.extension
  ? commander.extension
  : '.';

// Add period if not present already
if (ext[0] !== '.') {
  ext = '.' + ext.slice(0, ext.length);
}

module.exports = collisionFinder(dir, ext);
