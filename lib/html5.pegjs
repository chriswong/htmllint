html5
	= doctype EOF 			{ 
		lint.parser_warn("EMPTY_DOC", null, offset); 
	}
	/ doctype part+ EOF

doctype
	= f:("<!DOCTYPE"i [^>]* [>]) { 
		lint.parser_emit("DOCTYPE", f, offset);
	}
	/ !"<!DOCTYPE"i  		{ 
		lint.parser_warn("MISSING_DOCTYPE", null, offset); 
	}

part
	= comment
	/ tag
	/ f:char { 
		lint.parser_emit("CHAR", f, offset); 
	}

EOF
	= '\0' { 
		lint.parser_emit("EOF", null, offset);
	}

char
	= (!EOF) [^><&]
	/ entity
	/ amp
	/ lt
	/ gt

entity 
 	= [&] [a-z0-9]+ [;]
	/ [&] [#] [0-9]+ [;]
	/ [&] [#] [x] [a-f0-9]+ [;]

amp
	= [&] { 
		lint.parser_warn("ENCODE_AMP", null, offset); 
	}

lt
	= [<] & (!(_* tag_start_name)) { 
		lint.parser_warn("ENCODE_LT", null, offset); 
	}
	/ [<] & (!"!--") { 
		lint.parser_warn("ENCODE_LT", null, offset); 
	}
gt
	= [>] { 
		lint.parser_warn("ENCODE_GT", null, offset); 
	}

_ 
	= [ \f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]

comment
	 = "<!--" comment_text comment_end

comment_text
	= f:comment_text_char* {
		lint.parser_emit("COMMENT", f, offset);
	}

comment_text_char
    = (!EOF) [^-]
    / [-] &EOF
    / [-][^-]
    / [-] [-] &EOF
    / [-][-][^>]

comment_end
	= "-->"
	/ &EOF	{ 
		lint.parser_warn("COMMENT_UNTERMINATED", null, offset); 
	}

tag
	= open_tag
	/ close_tag

open_tag
	= "<" leading:_* tag_start_name attribute* trailing:_* open_tag_end {
		if(leading.length) { 
			lint.parser_warn('TAG_LEADING_SPACE', leading, offset);
		}
		if(trailing.length) {
			lint.parser_warn('TAG_TRAILING_SPACE', trailing, offset);
		}
	}

open_tag_end
	= ">" {
		lint.parser_emit("TAG_OPEN", null, offset);
	}
	/ f:"/>" {
		lint.parser_warn("TAG_SELF_CLOSED", f, offset);
		lint.parser_emit("TAG_OPEN", f, offset);
	}
	/ &EOF { 
		lint.parser_warn("TAG_UNTERMINATED", null, offset); 
	}

close_tag
 	= "</" leading:_* tag_close_name attribute:attribute* trailing:_* close_tag_end {
		if(leading.length) { 
			lint.parser_warn('TAG_LEADING_SPACE', leading, offset);
		}
		if(trailing.length) {
			lint.parser_warn('TAG_TRAILING_SPACE', trailing, offset);
		}
		if(attribute.length) {
			lint.parser_warn('TAG_ATTRIBUTE_IN_CLOSE', attribute, offset);
		}
	}

close_tag_end
	= ">"
	/ &EOF { 
		lint.parser_warn("TAG_UNTERMINATED", null, offset); 
	}

tag_start_name
	= namespace:(tag_string ":")? name:tag_string {
		if(namespace.length) {
			lint.parser_warn('TAG_WITH_NAMESPACE', namespace, offset);
		}
		lint.parser_emit("TAG_START", (namespace || []).concat(name), offset);
	}

tag_close_name
	= namespace:(tag_string ":")? name:tag_string {
		if(namespace.length) {
			lint.parser_warn('TAG_CLOSE_WITH_NAMESPACE', namespace, offset);
		}
		lint.parser_emit("TAG_CLOSE", (namespace || []).concat(name), offset);
	}

tag_string
	=[a-zA-Z][-a-zA-Z0-9_.]*

attribute 
	= leading:_* attr {
		if(leading.length === 0) {
			lint.parser_warn("ATTRIBUTE_MISSING_SPACE", null, offset);
		}
	}

attr
	= attribute_name (_? "=" _?) attribute_value
	/ attribute_name
	/ "=" { 
		lint.parser_warn("ATTRIBUTE_BAD_EQUALS", null, offset); 
	}

attribute_name
	= q:double_quoted_name { 
		lint.parser_warn("ATTRIBUTE_NAME_IN_DOUBLE_QUOTES", q, offset);  
	}
	/ q:single_quoted_name { 
		lint.parser_warn("ATTRIBUTE_NAME_IN_SINGLE_QUOTES", q, offset);  
	}
	/ namespace:(unquoted_name ":")? name:unquoted_name {
		if(namespace.length) {
			lint.parser_warn('ATTRIBUTE_WITH_NAMESPACE', namespace, offset);
		}
		lint.parser_emit("ATTRIBUTE_NAME", (namespace || []).concat(name), offset);
	}
	/ f:(unquoted_name ":") {
		lint.parser_warn("BAD_ATTRIBUTE_NAME_TRAILING_COLON", f, offset);
	}
	/ ":" {
		lint.parser_warn("BAD_ATTRIBUTE_NAME_COLON", null, offset);
	}

double_quoted_name
	= ["]  double_quoted_name_contents double_quoted_name_end

double_quoted_name_contents
	= f:double_quoted_name_char* {
		lint.parser_emit("ATTRIBUTE_NAME", f, offset);
	}

double_quoted_name_end
	= ["]
	/ &EOF	{ 
		lint.parser_warn("DOUBLED_QUOTED_NAME_UNTERMINATED", null, offset); 
	}

double_quoted_name_char
 	= entity
 	/ lt
 	/ gt
 	/ [\\].
 	/ (!EOF) [^"]

single_quoted_name
	= ['] single_quoted_name_contents single_quoted_name_end

single_quoted_name_contents
	= single_quoted_name_char*

single_quoted_name_end
	= [']
	/ &EOF	{ 
		lint.parser_warn("SINGLE_QUOTED_NAME_UNTERMINATED", null, offset); 
	}

single_quoted_name_char
 	= entity
 	/ lt
 	/ gt
 	/ [\\].
 	/ (!EOF) [^']

unquoted_name
 	= unquoted_name_char+

unquoted_name_char
  	= [/] ![>]  	
  	/ [<] { 
  		lint.parser_warn("ATTRIBUTE_NAME_BAD_LT", null, offset); 
  	}
  	/ [&] { lint.parser_warn("ATTRIBUTE_NAME_BAD_AMP", null, offset); 
  	}
 	/ (!EOF) [^:/>="' \f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]

attribute_value
	= double_quoted_value
	/ q:single_quoted_value { 
		lint.parser_warn("ATTRIBUTE_VALUE_IN_SINGLE_QUOTES", q, offset);  
	}
	/ q:unquoted_value { 
		lint.parser_warn("ATTRIBUTE_VALUE_UNQUOTED", q, offset);  
	}

double_quoted_value
	= ["] double_quoted_value_contents double_quoted_value_end

double_quoted_value_contents
	= f:double_quoted_value_char* {
		lint.parser_emit("ATTRIBUTE_VALUE", f, offset);
	}

double_quoted_value_end
	= ["]
	/ &EOF	{ 
		lint.parser_warn("DOUBLED_QUOTED_VALUE_UNTERMINATED", null, offset); 
	}

double_quoted_value_char
 	= entity
 	/ lt
 	/ gt
 	/ [\\].
 	/ (!EOF) [^"]

single_quoted_value
	= ['] single_quoted_value_contents single_quoted_value_end

single_quoted_value_contents
	 = f:single_quoted_value_char* {
	 	lint.parser_emit("ATTRIBUTE_VALUE", f, offset);
	 }

single_quoted_value_end
	= [']
	/ &EOF	{ 
		lint.parser_warn("SINGLE_QUOTED_VALUE_UNTERMINATED", null, offset); 
	}

single_quoted_value_char
 	= entity
 	/ lt
 	/ gt
 	/ [\\].
 	/ (!EOF) [^']

unquoted_value
 	= f:unquoted_value_char+ {
	 	lint.parser_emit("ATTRIBUTE_VALUE", f, offset);
	 }

unquoted_value_char
  	= [/] ![>]  	
  	/ [<] { 
  		lint.parser_warn("ATTRIBUTE_VALUE_BAD_LT", null, offset); 
  	}
  	/ [&] { lint.parser_warn("ATTRIBUTE_VALUE_BAD_AMP", null, offset); 
  	}
 	/ (!EOF) [^/>="' \f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]

