var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;
var uuidCollision = require('../index.js');

console.log(uuidCollision('.', '.'))


// describe('UUID Collisions', function() {
// 	it('Finds collisions in single file', function() {

// 		expect(uuidCollision('dir_0/test_0.html', '.')).to.equal(false)
// 	});
// });