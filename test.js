var _ = require('underscore'),
	lint = require('./lib/htmllint'),
	fs = require('fs'),
	util = require('util');

var src = fs.readFileSync(__dirname + "/test.html", "UTF-8"),
	res = _.sortBy( lint.lint(src), "offset" );

console.log( util.inspect(res, false, 10) );