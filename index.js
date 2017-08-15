'use-strict';

var _ = require('lodash');
var colors = require('colors');
var commander = require('commander');
var findInFiles = require('find-in-files');
var fs = require('fs');
var path = require('path');

// Parse command line arguments
commander
  .option('-d, --directory <directory>', 'Directory to search')
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

// Find UUID collisions in given directory, limited to file type sepcified in ext
function findCollisions(dir, ext) {

  // Throw error if directory doesn't exist
  if (!fs.existsSync(dir)) {
    console.log('');
    console.log('Directory doesn\'t exist!'.red);
    return;
  }

  findInFiles.find(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/, dir, ext)
  .then((data) => {
    var uuids = [];

    for (let result in data) {
      uuids.push(data[result].matches);
    }

    let duplicates = findDuplicates(_.flatten(uuids));

    let collisions = [];
    for (let i = 0; i < duplicates.length; i++) {
      let obj = {};
      obj = {
        uuid: duplicates[i],
        locations: getKeys(data, duplicates[i])
      }
      collisions.push(obj);
    }

    // Log collisions if any are present
    if (collisions.length) {
      outputError(collisions);

    // Log success message
    } else {
      console.log('');
      console.log('No collisions found!'.green);
    }

    return;
  });
}

/* =============================================================================
Helper functions
============================================================================= */

// Find duplicates in array
function findDuplicates(arr) {
	let resultArr = [];

	arr.forEach((element, index) => {
		if (arr.indexOf(element, index + 1) > -1) {
			if (resultArr.indexOf(element) === -1) {
				resultArr.push(element);
			}
		}
	});
	return resultArr;
}

// Get list of files where collisions are present
function getKeys(obj, value) {
  let keys = [];
  for (let key in obj) {
    if (obj[key].matches.indexOf(value) > -1) {
      keys.push(key);
    }
  }
  return keys;
}

// Log error to console
function outputError(collisions) {
  console.log('');
  for (let i = 0; i < collisions.length; i++) {
    console.log(`UUID Collision: ${collisions[i].uuid}`.red);
    console.log('Found in: ');
    for (let y = 0; y < collisions[i].locations.length; y++) {
      console.log(`${collisions[i].locations[y]}`.yellow);
    }
  console.log('');
  }
}

module.exports = findCollisions(dir, ext);