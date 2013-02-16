var _ = require('underscore'),
	$ = require('jquery'),
	peg = require('pegjs'),
	fs = require('fs'),
	elements = require('./elements');

var grammar = fs.readFileSync(__dirname + '/html5.pegjs', "UTF-8"),
	parser = peg.buildParser(grammar, { cache: true });

module.exports.lint = function Lint(src) {
	var info = [],
		res;

	var stack = [],
		str = "";

	global.warn = function(msg, match, offset) { 
		info.push({
			warning: msg,
			length: _.flatten(match).join('').length || 1,
			offset: offset
		});
	};
	global.emit = function(msg, match, offset) {
		var value = _.flatten(match).join('');

		switch(msg) {
			case "DOCTYPE" :
				if(value !== "<!DOCTYPE html>") {
					warn("INVALID_DOCTYPE", match, offset);
				}
				str = value;
				break;
			
			case "CHAR" :
				str += value;
				break;
			
			case "COMMENT" :
				str += "<!--" + value + "-->";
				break;
			
			case "TAG_START" :
				var lc_tag = value.toLowerCase();
				stack.unshift({
					tag: lc_tag,
					attributes: [],
					offsets: {
						tag:offset,
						attributes:{}
					}
				});

				//Warn if tags are not all lowercase
				if( value !== lc_tag ) {
					warn("NOT_LOWERCASE_TAG", [value], offset);
				}

				//Warn if tag is not listed under support
				if( elements[ lc_tag ] === undefined ) {
					warn("UNSUPPORTED_TAG", [value], offset);
				};
				break;

			case "TAG_OPEN" : 
				str += ("<" + stack[0].tag);
				_.each(stack[0].attributes, function(pair) {
					if(pair) {
						str += (" " + pair.join("="));	
					}
				});
				str += " lint:offsets = '" + JSON.stringify(stack[0].offsets) + "'";
				str += ">";

				//Do not allow void elements to remain on the stack
				if( elements[ stack[0].tag ] && elements[ stack[0].tag ].isVoid ) {
					stack.shift();
				}
				break;
			
			case "TAG_CLOSE" :
				var lc_tag = value.toLowerCase();

				if(stack[0].tag === lc_tag) {
					str += ("</" + stack[0].tag + ">");
					stack.shift();	
				}
				else {
					if( _.find(stack, function(item) { return item.tag === lc_tag; }) ) {
						warn("INCORRECT_CLOSE_TAG_ORDER", [value], offset);
						while(stack[0].tag !== lc_tag) {
							str += ("</" + stack[0].tag + ">");
							stack.shift();
						}
						str += ("</" + stack[0].tag + ">");
						stack.shift();
					}
					else {
						warn("UNOPENED_CLOSED_TAG", [value], offset);	
					}
				}

				//Warn if tags are not all lowercase
				if( value !== lc_tag ) {
					warn("NOT_LOWERCASE_TAG", [value], offset);
				}
				break;
			
			case "ATTRIBUTE_NAME" :
				var lc_attr = value.toLowerCase(),
					tag = stack[0].tag;

				if( _.find(stack[0].attributes, function(pair) { return pair[0] === lc_attr; }) ) {
					warn("DUPLICATE_ATTRIBUTE", [value], offset);
					stack[0].attributes.unshift(null);
				}
				else {
					stack[0].attributes.unshift([lc_attr]);
					stack[0].offsets.attributes[lc_attr] = { name: offset };
				}

				//If not global, element, or data then warn
				if( !(
					(elements["*"] && elements["*"].attributes && elements["*"].attributes[lc_attr]) ||
					(elements[tag] && elements[tag].attributes && elements[tag].attributes[lc_attr]) ||
					/^data-.+$/.test(lc_attr)
				  )	 ) 
				{
					warn("UNSUPPORTED_ATTRIBUTE", [value], offset);
				}

				//Warn if attributes are not all lowercase
				if( value !== lc_attr ) {
					warn("NOT_LOWERCASE_ATTRIBUTE", [value], offset);
				}
				break;
			
			case "ATTRIBUTE_VALUE" :

				if(stack[0].attributes[0] !== null) {
					stack[0].attributes[0].push('"' + value + '"');

					var lc_attr = stack[0].attributes[0][0];
					stack[0].offsets.attributes[lc_attr].value = offset;
				}
				break;
			
			case "EOF" :
				_.each(stack, function(value) {
					warn("UNCLOSED_TAG", null, offset);
				});
				break;

			default :
				throw new Error("Unsupported message " + msg);
		}
	};

	parser.parse(src + "\0");
	console.log( str );

	return info;
};
