html5
	= doctype EOF 			{ 
		warn("EMPTY_DOC", null, offset, line, column); 
	}
	/ doctype part+ EOF

doctype
	= f:"<!DOCTYPE html>" {
		emit("DOCTYPE", f, offset, line, column);
	}
	/ f:("<!DOCTYPE" [^>]* [>]) { 
		warn("INVALID_DOCTYPE", f, offset, line, column); 
		emit("DOCTYPE", f, offset, line, column);
	}
	/ !"<!DOCTYPE"  		{ 
		warn("MISSING_DOCTYPE", null, offset, line, column); 
	}

part
	= comment
	/ tag
	/ f:char { 
		emit("CHAR", f, offset, line, column); 
	}

EOF
	= '\0' { 
		emit("EOF", null, offset, line, column);
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
		warn("ENCODE_AMP", null, offset, line, column); 
	}

lt
	= [<] & (!(_* tag_name)) { 
		warn("ENCODE_LT", null, offset, line, column); 
	}
	/ [<] & (!"!--") { 
		warn("ENCODE_LT", null, offset, line, column); 
	}
gt
	= [>] { 
		warn("ENCODE_GT", null, offset, line, column); 
	}

_ 
	= [ \f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]

comment
	 = "<!--" comment_text comment_end

comment_text
	= f:comment_text_char* {
		emit("COMMENT", f, offset, line, column);
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
		warn("COMMENT_UNTERMINATED", null, offset, line, column); 
	}

tag
	= open_tag
	/ self_closing_tag
	/ close_tag

open_tag
	= "<" leading:_* tag_name attribute* trailing:_* open_tag_end {
		if(leading.length) { 
			warn('TAG_LEADING_SPACE', leading, offset, line, column);
		}
		if(trailing.length) {
			warn('TAG_TRAILING_SPACE', trailing, offset, line, column);
		}
	}

self_closing_tag
	= "<" leading:_* tag_name attribute* trailing:_* self_closing_tag_end {
		if(leading.length) { 
			warn('TAG_LEADING_SPACE', leading, offset, line, column);
		}
		if(trailing.length) {
			warn('TAG_TRAILING_SPACE', trailing, offset, line, column);
		}
	}

close_tag
 	= "</" leading:_* tag_name attribute:attribute* trailing:_* close_tag_end {
		if(leading.length) { 
			warn('TAG_LEADING_SPACE', leading, offset, line, column);
		}
		if(trailing.length) {
			warn('TAG_TRAILING_SPACE', trailing, offset, line, column);
		}
		if(attribute.length) {
			warn('TAG_ATTRIBUTE_IN_CLOSE', attribute, offset, line, column);
		}
	}

open_tag_end
	= ">" {
		emit("OPEN_TAG", null, offset, line, column);
	}
	/ &EOF { 
		warn("TAG_UNTERMINATED", null, offset, line, column); 
	}

self_closing_tag_end
	= "/>" {
		emit("SELF_CLOSE_TAG", null, offset, line, column); 
	}
	/ &EOF { 
		warn("TAG_UNTERMINATED", null, offset, line, column);
	}

close_tag_end
	= ">" {
		emit("CLOSE_TAG", null, offset, line, column); 
	}
	/ &EOF { 
		warn("TAG_UNTERMINATED", null, offset, line, column); 
	}

tag_name
	= namespace:(tag_string ":")? name:tag_string {
		if(namespace.length) {
			warn('TAG_WITH_NAMESPACE', namespace, offset, line, column);
		}
		emit("TAG_NAME", (namespace || []).concat(name), offset, line, column);
	}

tag_string
	=[a-zA-Z][-a-zA-Z0-9_.]*

attribute 
	= leading:_* attr {
		if(leading.length === 0) {
			warn("ATTRIBUTE_MISSING_SPACE", null, offset, line, column);
		}
	}

attr
	= attribute_name (_? "=" _?) attribute_value
	/ attribute_name
	/ "=" { 
		warn("ATTRIBUTE_BAD_EQUALS", null, offset, line, column); 
	}

attribute_name
	= q:double_quoted_name { 
		warn("ATTRIBUTE_NAME_IN_DOUBLE_QUOTES", q, offset, line, column);  
	}
	/ q:single_quoted_name { 
		warn("ATTRIBUTE_NAME_IN_SINGLE_QUOTES", q, offset, line, column);  
	}
	/ unquoted_name

double_quoted_name
	= ["]  double_quoted_name_contents double_quoted_name_end

double_quoted_name_contents
	= f:double_quoted_name_char* {
		emit("ATTRIBUTE_NAME", f, offset, line, column);
	}

double_quoted_name_end
	= ["]
	/ &EOF	{ 
		warn("DOUBLED_QUOTED_NAME_UNTERMINATED", null, offset, line, column); 
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
	= f:single_quoted_name_char* {
		emit("ATTRIBUTE_NAME", f, offset, line, column);
	}

single_quoted_name_end
	= [']
	/ &EOF	{ 
		warn("SINGLE_QUOTED_NAME_UNTERMINATED", null, offset, line, column); 
	}

single_quoted_name_char
 	= entity
 	/ lt
 	/ gt
 	/ [\\].
 	/ (!EOF) [^']

unquoted_name
 	= f:unquoted_name_char+ {
 		emit("ATTRIBUTE_NAME", f, offset, line, column);
 	}

unquoted_name_char
  	= [/] ![>]  	
  	/ [<] { 
  		warn("ATTRIBUTE_NAME_BAD_LT", null, offset, line, column); 
  	}
  	/ [&] { warn("ATTRIBUTE_NAME_BAD_AMP", null, offset, line, column); 
  	}
 	/ (!EOF) [^/>="' \f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]

attribute_value
	= double_quoted_value
	/ q:single_quoted_value { 
		warn("ATTRIBUTE_VALUE_IN_SINGLE_QUOTES", q, offset, line, column);  
	}
	/ q:unquoted_value { 
		warn("ATTRIBUTE_VALUE_UNQUOTED", q, offset, line, column);  
	}

double_quoted_value
	= ["] double_quoted_value_contents double_quoted_value_end

double_quoted_value_contents
	= f:double_quoted_value_char* {
		emit("ATTRIBUTE_VALUE", f, offset, line, column);
	}

double_quoted_value_end
	= ["]
	/ &EOF	{ 
		warn("DOUBLED_QUOTED_VALUE_UNTERMINATED", null, offset, line, column); 
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
	 	emit("ATTRIBUTE_VALUE", f, offset, line, column);
	 }

single_quoted_value_end
	= [']
	/ &EOF	{ 
		warn("SINGLE_QUOTED_VALUE_UNTERMINATED", null, offset, line, column); 
	}

single_quoted_value_char
 	= entity
 	/ lt
 	/ gt
 	/ [\\].
 	/ (!EOF) [^']

unquoted_value
 	= f:unquoted_value_char+ {
	 	emit("ATTRIBUTE_VALUE", f, offset, line, column);
	 }

unquoted_value_char
  	= [/] ![>]  	
  	/ [<] { 
  		warn("ATTRIBUTE_VALUE_BAD_LT", null, offset, line, column); 
  	}
  	/ [&] { warn("ATTRIBUTE_VALUE_BAD_AMP", null, offset, line, column); 
  	}
 	/ (!EOF) [^/>="' \f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]

