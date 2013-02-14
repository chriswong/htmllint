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

var read_tag = function tag(str, flags, rules) {
	var re = /^([<][/]?)([A-Za-z]+)(\s*$)?/,
		match = re.exec(str);
	
	if(match === null) {
		return { consumed: "" };
	}

	if(match[3] !== undefined || match[0] === str) {
		return {
			consumed:match[0],
			messages:[M.TAG_UNTERMINATED]
		};
	}

	return {
		consumed: match[0],
		next:[read_attribute, read_tag_end]
	};
};

	var read_tag_end = function tag_end(str, flags, rules) {
		var re = /^(\s+)?[/]?[>]/,
			match = re.exec(str);

		return {
			consumed: (match ? match[0] : ""),
			messages: (match ? (match[1] ? [M.TAG_TRAILING_SPACE] : []) : [M.TAG_UNTERMINATED])
		};
	};


var read_attribute = function attribute(str, flags, rules) {
	var re = /^\s+([^\s=<>]+)(\s*=\s*)?/,
		match = re.exec(str);
	
	if(match === null) {
		return { consumed: "" };
	}
	if(match[0] === str) {
		return {
			consumed:str,
			messages: [M.TAG_UNTERMINATED]
		};
	}
	return {
		consumed: match[0],
		next: match[2] ? [read_double_quoted_value, read_single_quoted_value, read_unquoted_value] : [read_attribute , read_tag_end]
	};
};

	var read_double_quoted_value = function double_quoted_value(str, flags, rules) {
		if(str[0] !== '"') { 
			return { consumed: "" };
		}

		var re = /[^\\]"|$/,
			match = re.exec(str);

		if(match[0] === "") {
			return {
				consumed: str.substring(0, match.index),
				messages: [M.ATTR_UNTERMINATED]
			};
		}

		return {
			consumed: str.substring(0, match.index + 2),
			next:[read_attribute, read_tag_end]
		};
	};

	var read_single_quoted_value = function single_quoted_value(str, flags, rules) {
		if(str[0] !== "'") { 
			return { consumed: "" };
		}

		var re = /[^\\]'|$/,
			match = re.exec( str );

		if(match[0] === "") {
			return {
				consumed: str.substring(0, match.index),
				messages: (flags.allow_single_quote_attribute ? [M.ATTR_UNTERMINATED] : [M.ATTR_SINGLE_QUOTES, M.ATTR_UNTERMINATED])
			};
		}

		return {
			consumed: str.substring(0, match.index + 2),
			messages: (flags.allow_single_quote_attribute ? [] : [M.ATTR_SINGLE_QUOTES]),
			next:[read_attribute, read_tag_end]
		};
	};

	var read_unquoted_value = function unquoted_value(str, flags, rules) {
		var re = /\s|<|>|$/,
			match = re.exec(str);

		if(match[0] === ' ' || match[0] === '>') {
			return {
				consumed: str.substring(0, match.index),
				messages: (flags.allow_no_quote_attribute ? [] : [M.ATTR_UNQUOTED]),
				next:[read_attribute, read_tag_end]
			};
		}

		if(match[0] === '' || match[0] === '<') {
			return {
				consumed: str.substring(0, match.index),
				messages: (flags.allow_no_quote_attribute ? [M.TAG_UNTERMINATED] : [M.ATTR_UNQUOTED, M.TAG_UNTERMINATED])
			};
		}
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
			options = (result.next || []);	
		}

		if(options.length === 0) {
			options = [read_tag, read_comment, read_cdata, read_chars];
		}
	}

	return messages;
};