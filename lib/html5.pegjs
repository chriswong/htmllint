html5
	= doctype EOF 			{ 
		warn("EMPTY_DOC", null, offset); 
	}
	/ doctype part+ EOF

doctype
	= f:("<!DOCTYPE"i [^>]* [>]) { 
		emit("DOCTYPE", f, offset);
	}
	/ !"<!DOCTYPE"i  		{ 
		warn("MISSING_DOCTYPE", null, offset); 
	}

part
	= comment
	/ tag
	/ f:char { 
		emit("CHAR", f, offset); 
	}

EOF
	= '\0' { 
		emit("EOF", null, offset);
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
		warn("ENCODE_AMP", null, offset); 
	}

lt
	= [<] & (!(_* tag_start_name)) { 
		warn("ENCODE_LT", null, offset); 
	}
	/ [<] & (!"!--") { 
		warn("ENCODE_LT", null, offset); 
	}
gt
	= [>] { 
		warn("ENCODE_GT", null, offset); 
	}

_ 
	= [ \f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]

comment
	 = "<!--" comment_text comment_end

comment_text
	= f:comment_text_char* {
		emit("COMMENT", f, offset);
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
		warn("COMMENT_UNTERMINATED", null, offset); 
	}

tag
	= open_tag
	/ close_tag

open_tag
	= "<" leading:_* tag_start_name attribute* trailing:_* open_tag_end {
		if(leading.length) { 
			warn('TAG_LEADING_SPACE', leading, offset);
		}
		if(trailing.length) {
			warn('TAG_TRAILING_SPACE', trailing, offset);
		}
	}

open_tag_end
	= ">" {
		emit("TAG_OPEN", null, offset);
	}
	/ f:"/>" {
		warn("TAG_SELF_CLOSED", f, offset);
		emit("TAG_OPEN", f, offset);
	}
	/ &EOF { 
		warn("TAG_UNTERMINATED", null, offset); 
	}

close_tag
 	= "</" leading:_* tag_close_name attribute:attribute* trailing:_* close_tag_end {
		if(leading.length) { 
			warn('TAG_LEADING_SPACE', leading, offset);
		}
		if(trailing.length) {
			warn('TAG_TRAILING_SPACE', trailing, offset);
		}
		if(attribute.length) {
			warn('TAG_ATTRIBUTE_IN_CLOSE', attribute, offset);
		}
	}

close_tag_end
	= ">"
	/ &EOF { 
		warn("TAG_UNTERMINATED", null, offset); 
	}

tag_start_name
	= namespace:(tag_string ":")? name:tag_string {
		if(namespace.length) {
			warn('TAG_WITH_NAMESPACE', namespace, offset);
		}
		emit("TAG_START", (namespace || []).concat(name), offset);
	}

tag_close_name
	= namespace:(tag_string ":")? name:tag_string {
		if(namespace.length) {
			warn('TAG_CLOSE_WITH_NAMESPACE', namespace, offset);
		}
		emit("TAG_CLOSE", (namespace || []).concat(name), offset);
	}

tag_string
	=[a-zA-Z][-a-zA-Z0-9_.]*

attribute 
	= leading:_* attr {
		if(leading.length === 0) {
			warn("ATTRIBUTE_MISSING_SPACE", null, offset);
		}
	}

attr
	= attribute_name (_? "=" _?) attribute_value
	/ attribute_name
	/ "=" { 
		warn("ATTRIBUTE_BAD_EQUALS", null, offset); 
	}

attribute_name
	= q:double_quoted_name { 
		warn("ATTRIBUTE_NAME_IN_DOUBLE_QUOTES", q, offset);  
	}
	/ q:single_quoted_name { 
		warn("ATTRIBUTE_NAME_IN_SINGLE_QUOTES", q, offset);  
	}
	/ namespace:(unquoted_name ":")? name:unquoted_name {
		if(namespace.length) {
			warn('ATTRIBUTE_WITH_NAMESPACE', namespace, offset);
		}
		emit("ATTRIBUTE_NAME", (namespace || []).concat(name), offset);
	}
	/ f:(unquoted_name ":") {
		warn("BAD_ATTRIBUTE_NAME_TRAILING_COLON", f, offset);
	}
	/ ":" {
		warn("BAD_ATTRIBUTE_NAME_COLON", null, offset);
	}

double_quoted_name
	= ["]  double_quoted_name_contents double_quoted_name_end

double_quoted_name_contents
	= f:double_quoted_name_char* {
		emit("ATTRIBUTE_NAME", f, offset);
	}

double_quoted_name_end
	= ["]
	/ &EOF	{ 
		warn("DOUBLED_QUOTED_NAME_UNTERMINATED", null, offset); 
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
		warn("SINGLE_QUOTED_NAME_UNTERMINATED", null, offset); 
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
  		warn("ATTRIBUTE_NAME_BAD_LT", null, offset); 
  	}
  	/ [&] { warn("ATTRIBUTE_NAME_BAD_AMP", null, offset); 
  	}
 	/ (!EOF) [^:/>="' \f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]

attribute_value
	= double_quoted_value
	/ q:single_quoted_value { 
		warn("ATTRIBUTE_VALUE_IN_SINGLE_QUOTES", q, offset);  
	}
	/ q:unquoted_value { 
		warn("ATTRIBUTE_VALUE_UNQUOTED", q, offset);  
	}

double_quoted_value
	= ["] double_quoted_value_contents double_quoted_value_end

double_quoted_value_contents
	= f:double_quoted_value_char* {
		emit("ATTRIBUTE_VALUE", f, offset);
	}

double_quoted_value_end
	= ["]
	/ &EOF	{ 
		warn("DOUBLED_QUOTED_VALUE_UNTERMINATED", null, offset); 
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
	 	emit("ATTRIBUTE_VALUE", f, offset);
	 }

single_quoted_value_end
	= [']
	/ &EOF	{ 
		warn("SINGLE_QUOTED_VALUE_UNTERMINATED", null, offset); 
	}

single_quoted_value_char
 	= entity
 	/ lt
 	/ gt
 	/ [\\].
 	/ (!EOF) [^']

unquoted_value
 	= f:unquoted_value_char+ {
	 	emit("ATTRIBUTE_VALUE", f, offset);
	 }

unquoted_value_char
  	= [/] ![>]  	
  	/ [<] { 
  		warn("ATTRIBUTE_VALUE_BAD_LT", null, offset); 
  	}
  	/ [&] { warn("ATTRIBUTE_VALUE_BAD_AMP", null, offset); 
  	}
 	/ (!EOF) [^/>="' \f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]

