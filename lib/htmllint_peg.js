var _ = require('underscore'),
	peg = require('pegjs'),
	fs = require('fs');

var grammar = fs.readFileSync(__dirname + '/html5.pegjs', "UTF-8"),
	parser = peg.buildParser(grammar, { trackLineAndColumn: true, cache: true });

module.exports.lint = function Lint(src) {
	var info = [],
		res;

	global.warn = function(msg, match, offset, line, column) { 
		info.push({
			warning: msg,
			length: _.flatten(match).join('').length || 1,
			offset: offset,
			line: line,
			column: column
		});
	};
	global.emit = function(msg, match, offset, line, column) {
		//Run rule on the emitted match
		var value = _.flatten(match).join('');
		console.log("(" + line + "," + column + ") " + msg + " : " + value);
	};

	parser.parse(src + "\0");
	
	return info;
};
