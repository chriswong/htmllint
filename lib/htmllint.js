/*jslint nomen: true, white: true, node: true */
"use strict";

var _ = require('underscore'),
	FLAG_DEFAULTS = require('./flags.js');

/************************************************************************
 *																		*
 *						   Specific Parsers								*
 *																		*
 ************************************************************************/
var read_doctype = function doctype(str) {
	var re = /^([^<]*)([<][!](DOCTYPE\s+html|[^>]*)[>])?([ \t]*\n?)/,
		match = re.exec(str),
		messages = [];
	
	if(match[1] !== '') {
		messages.push("The DOCTYPE should be the first line without any leading characters.");
	}
	if(match[2] !== "<!DOCTYPE html>") {
		messages.push("DOCTYPE should be '<!DOCTYPE html>'.");
	}
	if(match[4] !== '\n') {
		messages.push("DOCTYPE should be immediately followed by a new line.");
	}
	return {
		messages:messages,
		consumed: match[0]
	};
};

var read_comment = function comment(str) {
	if( str.indexOf("<!>") === 0) {
		return {
			messages: ["Bogus comment."],
			consumed: "<!>"
		};
	}

	if( str.indexOf("<!--") === 0 ) {
		var next = str.indexOf("-->", 4),
			contents = str.substring(4, next);

		return {
			messages: ( contents.length === 0 || /^\s+$/.test(contents) ? [ "Remove empty comment" ] : []),
			consumed: str.substring(0, (next === -1 ? str.length : next + 3) )
		};
	}
	return {
		consumed: ""
	};
};

var read_tag_open = function tag_open(str) {
	var re = /^([<][/]|[<])\s*(\w+)/,
		match = re.exec(str);
	
	if(match === null) {
		return { 
			consumed:""
		};
	}

	//TODO: Test tag in context

	return {
		consumed: match[0],
		next: (match[2] === "</" ? [read_tag_close] : [read_attribute_space, read_tag_close])
	};
};

var read_attribute_space = function attr_space(str) {
	var r = read_white(str);
	r.next = [read_attribute, read_tag_close];
	return r;
};

var read_attribute = function attribute(str) {
	var re = /^([-A-Za-z0-9_]+)(\s*=\s*("((?:\\.|[^"])*)"|("((?:\\.|[^'])*)')))?/,
		match = re.exec(str),
		name, value;
	
	if(match) {

		name = match[1],
		value = match[3];
		if(value !== undefined) {
			value = value.substring(1, value.length - 1);
		}
		
		//TODO: Test Attribute in context

		return {
			consumed: match[0],
			next: [read_attribute_space, read_tag_close]
		};
	}

	return {
		consumed: ""
	}
}

var read_tag_close = function tag_close(str) {
	var re = /^\s*([/][>]|[>])/,
		match = re.exec(str);
	if(match) {
		return {
			consumed: match[0]
		};
	}
}

var read_white = function whitespace(str) {
	var re = /^\s+/,
		match = re.exec(str);
	return {
		consumed: (match ? match[0] : "")
	};
};

var read_chars = function chars(str) {
	var re = /^([^<]|\n|$)*/,
		match = re.exec(str);

	//TODO: text characters in context

	return {
		consumed: match[0]
	};
};

/************************************************************************
 *																		*
 *						   Main Function								*
 *																		*
 ************************************************************************/
var Lint = exports.Lint = function HTMLLint(str, flags) {
	flags = _.extend(flags || {}, FLAG_DEFAULTS );
	
	var messages = [],
		remaining = str,
		next = [read_doctype],
		new_lines = 0,
		line = 1,
		character = 1,
		result,
		i;

	while(remaining) {
		for(i = 0; i < next.length; i = i + 1) {
			result = next[i](remaining);

			if(result) {
				console.log(line + "," + character + " : " + next[i].name + "(" + result.consumed.length + ")" + result.consumed);

				//Save all messages that are provided
				if(result.messages) {
					_.each(result.messages, function(msg) {
						messages.push( {line:line, source: next[i].name, message:msg} );
					});	
				}
				

				if( result.consumed.length ) {
					//Remove the consumed text
					remaining = remaining.substring(result.consumed.length);
					
					//Advance the current line and character based on consumed text
					new_lines = result.consumed.split("\n");
					if(new_lines.length > 1) {
						line += (new_lines.length - 1);
						character = new_lines[ new_lines.length - 1 ].length + 1;
					}
					else {
						character += new_lines[0].length;	
					}
					

					
					//Set the next parse options
					next = (result.next ? result.next : [read_white, read_tag_open, read_comment, read_chars]);	

					break;
				}
			}
			else {
				messages.push( {line:line, message:"General Parsing Error"} );
				remaining = "";
			}
		}
	}

	return messages;
};