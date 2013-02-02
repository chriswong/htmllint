/*jslint nomen: true, white: true, node: true */
"use strict";

//http://google-styleguide.googlecode.com/svn/trunk/htmlcssguide.xml
//
var _ = require('underscore'),
	M = require('./messages'),
	FLAG_DEFAULTS = require('./flags'),
	RULES_DEFAULTS = require('./rules');

/************************************************************************
 *																		*
 *						   Specific Parsers								*
 *																		*
 ************************************************************************/
var read_doctype = function doctype(str, flags, rules) {
	if(str.indexOf("<!DOCTYPE html>\n") === 0) {
		return {
			consumed: "<!DOCTYPE html>"
		}
	}

	var re = /^\s*[<][!]\s*DOCTYPE[^>]*[>]/,
		match = re.exec(str);

	//Consume any other well-formed but incorrect doctypes
	if(match) {
		return {
			consumed:match[0],
			messages: [M.DOCTYPE_BAD]
		};
	}

	return {
		consumed:"",
		messages: (flags.doctype_optional ? [] : [M.DOCTYPE_BAD])
	};
}

var read_comment = function comment(str, flags, rules) {
	if( str.indexOf("<!--") === 0 ) {
		var next = str.indexOf("-->", 4),
			contents = str.substring(4, next);

		if(next === -1) {
			return {
				messages: [M.COMMENT_UNTERMINATED],
				consumed: str
			};
		}

		return {
			messages: ( contents.length === 0 || /^\s+$/.test(contents) ? [ M.COMMENT_EMPTY ] : []),
			consumed: str.substring(0, (next === -1 ? str.length : next + 3) )
		};
	}

	return {
		consumed: ""
	};
};

var read_cdata = function cdata(str, flags, rules) {
	if( str.indexOf("<![CDATA[") === 0) {
		var next = str.indexOf("]]>"),
			contents = str.substring(9, next);
		if(next === -1) {
			return {
				messages: [ M.CDATA_UNTERMINATED ],
				consumed: str
			};
		}
		return {
			messages: ( contents.length === 0 || /^\s+$/.test(contents) ? [ M.CDATA_EMPTY ] : []),
			consumed: str.substring(0, (next === -1 ? str.length : next + 3) )
		};
	}

	return {
		consumed: ""
	}
}

var read_tag = function tag_open(str, flags, rules) {
	var re = /^([<][/]?)(\s+)?([A-Za-z]+)((\s+)?([/]?[>]))?/,
		match = re.exec(str),
		messages = [],
		start, leading, name, close, trailing, end;
	
	if(match === null) {
		return { 
			consumed:""
		};
	}

	start = match[1];
	leading = match[2];
	name = match[3];
	close = match[4];
	trailing = match[5];
	end = match[6];

	if(leading !== undefined) {
		messages.push(M.TAG_LEADING_SPACE);
	}

	//TODO: Test tag in context

	if(close) {
		if(trailing !== undefined) {
			messages.push(M.TAG_TRAILING_SPACE);
		}
		return {
			consumed:match[0],
			messages:messages
		};
	}

	return {
		consumed: match[0],
		messages: messages,
		next: (start === "</" ? [read_tag_close, read_tag_garbage] : [read_attribute, read_tag_close, read_tag_garbage])
	};
};

var read_attribute = function attribute(str, flags, rules) {
	var re = /^\s+([A-Za-z]+)(\s*=\s*("((?:\\.|[^"])*)"|("((?:\\.|[^'])*)')))?/,
		match = re.exec(str),
		name, value;
	
	if(match) {
		console.log(match);
		
		name = match[1],
		value = match[3];
		if(value !== undefined) {
			value = value.substring(1, value.length - 1);
		}
		
		//TODO: Test Attribute in context

		return {
			consumed: match[0],
			next: [read_attribute, read_tag_close, read_tag_garbage]
		};
	}

	return {
		consumed: "",
		next: [read_tag_close, read_tag_garbage]
	}
}

var read_tag_close = function tag_close(str, flags, rules) {
	var re = /^\s*([/][>]|[>])/,
		
		match = re.exec(str);

	if(match) {
		return {
			consumed: match[0]
		};
	}

	return {
		consumed:""
	};
}

var read_tag_garbage = function tag_garbage(str, flags, rules) {
	var re = /(^.*?)([/][>]|[>]|$)/,
		match = re.exec(str);

	return {
		messages: [M.TAG_GARBAGE],
		consumed: match[1],
		next: [read_tag_close]
	};
};

var read_white = function whitespace(str, flags) {
	var re = /^\s+/,
		match = re.exec(str);

	return {
		consumed: (match ? match[0] : "")
	};
};

var read_chars = function chars(str, flags, rules) {
	//capture: encoded entity, ampersand, any string of non-ampersands and non-brackets
	var re = /^(&(?:[a-z\d]+|#\d+|#x[a-f\d]+);|&|[<]|[>]|[^&<>]+)/,
		match = re.exec(str),
		messages = [];

	//TODO: text characters in context
	
	if(match[1] === "&") {
		messages.push(M.TEXT_ENCODE_AMP);
	}
	if(match[1] === "<") {
		messages.push(M.TEXT_ENCODE_LT);
	}
	if(match[1] === ">") {
		messages.push(M.TEXT_ENCODE_GT);
	}

	return {
		messages: messages,
		consumed: match[0]
	};
};

/************************************************************************
 *																		*
 *						   Main Function								*
 *																		*
 ************************************************************************/
var Lint = exports.Lint = function HTMLLint(str, flags, rules) {
	flags = _.defaults(flags || {}, FLAG_DEFAULTS);
	rules = _.defaults(rules || {}, RULES_DEFAULTS);

	var messages = [],
		remaining = str,
		test = null,
		options = [read_doctype],
		new_lines = 0,
		line = 1, column = 1, character = 1,
		result,
		tab_replacement = "",
		i;

	for(i = 0; i < parseInt(flags.tabwidth); i = i + 1) {
		tab_replacement += " ";
	}

	if(/^s*$/.test(remaining)) {
		remaining = "";
		messages.push( {line:line, character: character, column: column, source: Lint.name, message:M.EMPTY_DOC} );
	}

	while(remaining) {
		test = options.shift();
		result = test(remaining, flags, rules);
		if( !result) { throw new Error("Empty Result"); }

		if(flags.debug) {
			console.log(line + "," + column + " : " + test.name + "(" + result.consumed.length + ") '" + result.consumed + "'");	
		}
		
		//Save all messages that are provided
		_.each(result.messages || [], function(msg) {
			messages.push( {line:line, character: character, column: column, source: test.name, message:msg} );
		});	

		if( result.consumed.length ) {
			//Remove the consumed text
			remaining = remaining.substring(result.consumed.length);
			
			//Advance the current line, column and character based on consumed text
			new_lines = result.consumed.split("\n");
			if(new_lines.length > 1) {
				line += (new_lines.length - 1);
				character = new_lines[ new_lines.length - 1 ].length + 1;
				column = new_lines[ new_lines.length - 1 ].replace('\t', tab_replacement).length + 1;
			}
			else {
				character += new_lines[0].length;
				column += new_lines[0].replace('\t', tab_replacement).length;	
			}
			
			//Reset the parse options
			options = (result.next ? result.next : []);	
		}

		if(options.length === 0) {
			options = [read_white, read_tag, read_comment, read_cdata, read_chars];
		}
	}

	return messages;
};