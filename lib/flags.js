/*jslint nomen: true, white: true, node: true */
"use strict";

module.exports = {
	//Print out the parsing progress
	debug: false,
	
	//Set the assumed tab-width to make sure that column outputs match the source
	tabwidth: 4,

	//Allowed the declaration of the doctype to be option, if present it still must be wellformed
	doctype_optional: false,

	//Allow tag attribute values to use single quotes
	allow_single_quote_attribute: false
};