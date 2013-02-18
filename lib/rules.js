/*jslint nomen: true, white: true, node: true */
"use strict";
var $ = require('jquery');

module.exports = [
	{ on: "div:not([class])", test: function(index, element, lint) {
		lint.warn("CLASSLESS_DIV");	
	} },
	{ on: "*", test: function(index, element, lint) {
		var cls = $(this).attr('class');
		if(/^\s*$/.test(cls)) {
			lint.warn({
				valueof: 'class',
				warn: "EMPTY_CLASS"
			});
		}
	} },
	{ on: "*[data-foo]", test: function(index, element, lint) {
		var foo = $(this).attr('data-foo'),
			i = foo.indexOf("world");
		if(i !== -1) {
			lint.warn({
				valueof: 'data-foo',
				warn: "No Worlds",
				offset: i,
				match:"world"
			});
		}
	} }
];	