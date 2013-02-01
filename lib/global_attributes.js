/*jslint nomen: true, white: true, node: true */
"use strict";

//
// Validation methodolgies for global attributes
// https://developer.mozilla.org/en-US/docs/HTML/Global_attributes
//
module.exports = {
	"accesskey" : [
		function(name, value, flags) { 
			//TODO: Space seperated list of single characters
		}
	],
	"class" : [
		function(name, value, flags) {
			//TODO: Space-separated list of the class names 
		}
	],
	"contenteditable" : [
		function(name, value, flags) {
			//TODO: true, false, or empty string (warn on empty)
		}
	],
	"contextmenu" : [
		function(name, value, flags) {
			//TODO: any id, must exist in final document
		}
	],
	"data-*" : [
		function(name, value, flags) {
			//TODO: the name must not start with xml, whatever case is used for these letters;
			//		the name must not contain any semicolon (U+003A);
			//		the name must not contain capital A to Z letters.
		}
	],
	"dir" : [
		function(name, value, flags) {
			//TODO ltr, rtl, auto
		}
	],
	"draggable" : [
		function(name, value, flags) {
			//TODO: true, false
		}
	],
	"dropzone" : [
		function(name, value, flags) {
			//TODO: move, copy, link
			//		warn unimplemented
		}
	],
	"hidden" : [
		function(name, value, flags) {
			//TODO: hidden should be null (boolean attribute)
		}
	],
	"id" : [
		function(name, value, flags) {
			//TODO: character, then char, digit, -, _
			//		must be unique in final documnent
		}
	],
	"itemid" : [
		function(name, value, flags) {
			//TODO: no tests
		}
	],
	"itemprop" : [
		function(name, value, flags) {
			//TODO: no tests
		}
	],
	"itemref" : [
		function(name, value, flags) {
			//TODO: no tests
		}
	],
	"itemscope" : [
		function(name, value, flags) {
			//TODO: no tests
		}
	],
	"itemtype" : [
		function(name, value, flags) {
			//TODO: no tests
		}
	],
	"lang" : [
		function(name, value, flags) {
			//Tags for Identifying Languages (BCP47)
			//http://www.ietf.org/rfc/bcp/bcp47.txt
			//or empty
		}
	],
	"spellcheck" : [
		function(name, value, flags) {
			//TODO: true, false
		}
	],
	"style" : [
		function(name, value, flags) {
			//TODO: Warn if present, except with flag
		}
	],
	"tabindex" : [
		function(name, value, flags) {
			//TODO: positive, negative, or zero integer
		}
	],
	"title" : [
		function(name, value, flags) {
			//TODO: check for encoding invariance
		}
	]
};