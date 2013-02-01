var fs = require("fs"),
	path = require("path"),
	util = require("util"),
	lint = require('./lib/htmllint.js').Lint;

fs.readFile( path.join(__dirname, "tests", "basic.html"), "utf-8", function(err, str) {
	if(err) throw err;
	var results = lint(str);
	console.log( util.inspect(results, false, 10) );
});