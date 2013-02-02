/*jslint nomen: true, white: true, node: true */
'use strict';

module.exports = {
	/** Parse */
	PARSE_ERROR : 'General Parsing Error',

	/** Doc Empty */
	EMPTY_DOC : 'Document cannot be empty',

	/** Doc Type */
	DOCTYPE_BAD : 'Make "<!DOCTYPE html>" the first line without any leading characters, immediately followed by a newline.',

	/** Comments */
	COMMENT_EMPTY : 'Remove empty comment',
	COMMENT_UNTERMINATED : 'Add end to comment',

	/** CDATA */
	CDATA_EMPTY: 'Remove empty cdata',
	CDATA_UNTERMINATED : 'Add end to cdata',

	/** Text */
	TEXT_ENCODE_AMP : 'Encode & as &amp;',
	TEXT_ENCODE_LT : 'Encode < as &lt;',
	TEXT_ENCODE_GT : 'Encode > as &gt;',

	/** Tags */
	TAG_LEADING_SPACE : 'Remove leading space from tag name',
	TAG_TRAILING_SPACE : 'Remove trailing space from tag name',
	TAG_GARBAGE : 'Remove garbage from tag'
};