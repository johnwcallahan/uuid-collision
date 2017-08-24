'use strict';

var _ = require('lodash');
var colors = require('colors');
var findInFiles = require('find-in-files');
var fs = require('fs');

// Find UUID collisions in given directory, limited to file type sepcified in ext
var findCollisions = function(dir, ext, callback) {
  var data = {};

  // Throw error if directory doesn't exist
  if (!fs.existsSync(dir)) {
    if (!callback) {
      console.log('');
      console.log('Directory doesn\'t exist!'.red);
    }
    data = {
      "status": "ERROR",
      "message": "Directory doesn't exist!",
      "params": {
        "dir": dir,
        "ext": ext
      },
      "collisions": {}
    };
    if (callback) return callback(data);
  }

  findInFiles.findSync(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/, dir, ext)
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
      };
      collisions.push(obj);
    }

    // Log collisions if any are present
    if (collisions.length) {
      if (!callback) {
        logCollisions(collisions);
      }
      if (callback) return callback(getCollisions(collisions, dir, ext));

    // Log success message
    } else {
      if (!callback) {
        console.log('');
        console.log('No collisions found!'.green);
      }
      data = {
        "status": "SUCCESS",
        "message": "No collisions found!",
        "params": {
          "dir": dir,
          "ext": ext
        },
        "collisions": {}
      };
    }
    if (callback) return callback(data);
    return;
  });
};

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

// Log collisions to console
function logCollisions(collisions, dir, ext) {
  console.log('');
  for (let i = 0; i < collisions.length; i++) {
    console.log('');
    console.log(`UUID Collision: ${collisions[i].uuid}`.red);
    console.log('Found in: ');
    for (let y = 0; y < collisions[i].locations.length; y++) {
      console.log(`${collisions[i].locations[y]}`.yellow);
    }
  }
}

// Get object detailing collisions
function getCollisions(collisions, dir, ext) {
  var collisionHash = {};
  for (let i = 0; i < collisions.length; i++) {
    collisionHash[collisions[i].uuid] = [];
    for (let y = 0; y < collisions[i].locations.length; y++) {
      collisionHash[collisions[i].uuid].push(collisions[i].locations[y]);
    }
  }
  var obj = {
    "status": "SUCCESS",
    "message": "Collisions",
    "params": {
      "dir": dir,
      "ext": ext
    },
    "collisions": collisionHash
  };
  return obj;
}

module.exports = findCollisions;
