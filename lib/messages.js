/*jslint nomen: true, white: true, node: true */
'use strict';

module.exports = {
	/** Parse */
	PARSE_ERROR : 'General Parsing Error',

	/** Doc Type */
	DOCTYPE_BAD : 'Make "<!DOCTYPE html>" the first line without any leading characters, immediately followed by a newline.',

	/** Comments */
	COMMENT_BOGUS : 'Remove bogus comment',
	COMMENT_EMPTY : 'Remove empty comment',

	/** Text */
	TEXT_ENCODE_AMP : 'Encode & as &amp;',
	TEXT_ENCODE_LT : 'Encode < as &lt;',
	TEXT_ENCODE_GT : 'Encode > as &gt;',

	/** Tags */
	TAG_GARBAGE : 'Remove garbage from tag'
};