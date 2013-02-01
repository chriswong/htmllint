/*jslint nomen: true, white: true, node: true */
"use strict";

//http://google-styleguide.googlecode.com/svn/trunk/htmlcssguide.xml
//
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
		messages.push("Make DOCTYPE the first line without any leading or trailing characters");
	}
	if(match[2] !== "<!DOCTYPE html>") {
		messages.push("Make DOCTYPE '<!DOCTYPE html>'");
	}
	if(match[4] !== '\n') {
		messages.push("Immediately follow DOCTYPE with a new line");
	}
	return {
		messages:messages,
		consumed: match[0]
	};
};

var read_comment = function comment(str) {
	if( str.indexOf("<!>") === 0) {
		return {
			messages: ["Remove bogus comment"],
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
	var re = /^([<][/]?)\s*([-_A-Za-z0-9]+)/,
		match = re.exec(str);
	
	if(match === null) {
		return { 
			consumed:""
		};
	}

	//TODO: Test tag in context

	return {
		consumed: match[0],
		next: (match[1] === "</" ? [read_tag_close, read_tag_garbage] : [read_attribute_space, read_tag_close, read_tag_garbage])
	};
};

var read_attribute_space = function attr_space(str) {
	var r = read_white(str);
	r.next = [read_attribute, read_tag_close, read_tag_garbage];
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
			next: [read_attribute_space, read_tag_close, read_tag_garbage]
		};
	}

	return {
		consumed: "",
		next: [read_tag_close, read_tag_garbage]
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

	return {
		consumed:""
	};
}

var read_tag_garbage = function tag_garbage(str) {
	var re = /(^.*?)([/][>]|[>]|$)/,
		match = re.exec(str);
	return {
		messages: ["Remove garbage from tag"],
		consumed: match[1],
		next: [read_tag_close]
	};
};

var read_white = function whitespace(str) {
	var re = /^\s+/,
		match = re.exec(str);
	return {
		consumed: (match ? match[0] : "")
	};
};

var read_chars = function chars(str) {
	//capture: encoded entity, ampersand, any string of non-ampersands and non-brackets
	var re = /^(&(?:[a-z\d]+|#\d+|#x[a-f\d]+);|&|[<]|[>]|[^&<>]+)/,
		match = re.exec(str),
		messages = [];

	//TODO: text characters in context
	//
	if(match[1] === "&") {
		messages.push("Encode & as &amp;");
	}
	if(match[1] === "<") {
		messages.push("Encode < as &lt;");
	}
	if(match[1] === ">") {
		messages.push("Encode > as &gt;");
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
var Lint = exports.Lint = function HTMLLint(str, flags) {
	flags = _.extend(flags || {}, FLAG_DEFAULTS );
	
	var messages = [],
		remaining = str,
		options = [read_doctype],
		new_lines = 0,
		line = 1,
		column = 1,
		character = 1,
		result,
		tab_replacement = "";
		i;

	for(var i = 0; i < parseInt(flags.tabwidth); i = i + 1) {
		tab_replacement += " ";
	}

	while(remaining) {
		for(i = 0; i < options.length; i = i + 1) {
			result = options[i](remaining);

			if(result) {
				console.log(line + "," + column + " : " + options[i].name + "(" + result.consumed.length + ") '" + result.consumed + "'");

				//Save all messages that are provided
				if(result.messages) {
					_.each(result.messages, function(msg) {
						messages.push( {line:line, character: character, column: column, source: options[i].name, message:msg} );
					});	
				}
				

				if( result.consumed.length ) {
					//Remove the consumed text
					remaining = remaining.substring(result.consumed.length);
					
					//Advance the current line and column based on consumed text
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
					
					//Set the next parse options
					options = (result.next ? result.next : [read_white, read_tag_open, read_comment, read_chars]);	

					break;
				}
			}
			else {
				messages.push( {line:line, character:character, column:column, source: Lint.name, message:"General Parsing Error"} );
				remaining = "";
			}
		}
	}

	return messages;
};