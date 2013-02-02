var _ = require("underscore"),
	fs = require("fs"),
	path = require("path"),
	lint = require('../lib/htmllint.js').Lint;

var names = fs.readdirSync( path.join(__dirname) );
	
_.chain(names)
	.filter(function(name) {
		return path.extname(name) === ".html"
	})
	.each(function(name) {
		module.exports[name] = function(test) {
			var html_path = path.join(__dirname, name),
				opt_path  = path.join(__dirname, path.basename(name, ".html") + ".js"),
				html = "",
				options = { },
				actual = null;
			
			if( fs.existsSync( opt_path ) ) {
				options = require(opt_path);
			}

			html = fs.readFileSync(html_path, 'UTF-8');
			actual = lint(html, options.flags || {}, options.rules || {});

			test.expect(1);
			test.deepEqual(actual, options.results || []);
			test.done();
		};
	});