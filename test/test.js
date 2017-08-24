var collisionFinder = require('../lib/collisionFinder');

var mocha = require('mocha');
var chai = require('chai');
var assert = require('assert');

var expect = chai.expect;

var ID_1 = '65506863-548f-49e0-9dd5-0632efd953b7';
var ID_2 = '194e6127-d500-4c8f-85ba-2b3b35c40587';
var ID_3 = '194e6127-d500-4c8f-85ba-2b3b35c40587';

describe('#Collisions', function() {

	it('returns SUCCESS when given valid directory', function(done) {
		var data;
		collisionFinder(__dirname, 'js', function(res) {
			data = res;
		});
		setTimeout(function() {
			expect(data.status).to.equal('SUCCESS');
			done();
		}, 100);
	});

	it('returns ERROR when given invalid directory', function(done) {
		var data;
		collisionFinder('?', 'js', function(res) {
			data = res;
		});
		setTimeout(function() {
			expect(data.status).to.equal('ERROR');
			done();
		}, 100);
	});

	it('finds collisions across multiple files', function(done) {
		var data;
		collisionFinder(__dirname, 'js', function(res) {
			data = res;
		});
		setTimeout(function() {
			expect(data.message).to.equal('Collisions');
			done();
		}, 100);
	});

	it('finds collisions across multiple file types', function(done) {
		var data;
		collisionFinder(__dirname, '.', function(res) {
			data = res;
		});
		setTimeout(function() {
			expect(data.message).to.equal('Collisions');
			done();
		}, 100);
	});

	it('returns negative when no collisions found', function(done) {
		var data;
		collisionFinder(__dirname + '/testData3', '.', function(res) {
			data = res;
		});
		setTimeout(function() {
			expect(data.message).to.equal('No collisions found!');
			done();
		}, 100);
	});

});
