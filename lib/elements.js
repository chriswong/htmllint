/*jslint nomen: true, white: true, node: true */
"use strict";

//
// Validation methodolgies for elements
// https://developer.mozilla.org/en-US/docs/HTML/Element
//

module.exports = {
	"*" : { 
		attributes: {
			"accesskey" : true,
			"class" : true,
			"contenteditable" : true,
			"contextmenu" : true,
			"dir" : true,
			"draggable" : true,
			"dropzone" : true,
			"hidden" : true,
			"id" : true,
			"itemid" : true,
			"itemprop" : true,
			"itemref" : true,
			"itemscope" : true,
			"itemtype" : true,
			"lang" : true,
			"spellcheck" : true,
			"style" : true,
			"tabindex" : true,
			"title" : true
		}
	},
	"a" : { 
		attributes: { 
			"charset" : true,
			"coords" : true,
			"download" : true,
			"href" : true,
			"hreflang" : true,
			"media" : true,
			"name" : true,
			"ping" : true,
			"rel" : true,
			"rev" : true,
			"shape" : true,
			"target" : true,
			"type" : true
		}
	},
	"abbr" : { 
		attributes: { }
	},
	"acronym" : { 
		attributes: { }
	},
	"address" : { 
		attributes: { }
	},
	"applet" : { 
		attributes: { 
			"align" : true,
			"alt" : true,
			"archive" : true,
			"code" : true,
			"codebase" : true,
			"datafld" : true,
			"datasrc" : true,
			"height" : true,
			"hspace" : true,
			"mayscript" : true,
			"name" : true,
			"object" : true,
			"src" : true,
			"vspace" : true,
			"width" : true
		}
	},
	"area" : { 
		isVoid: true, 
		attributes: { 
			"accesskey" : true,
			"alt" : true,
			"coords" : true,
			"href" : true,
			"hreflang" : true,
			"name" : true,
			"media" : true,
			"nohref" : true,
			"rel" : true,
			"tabindex" : true,
			"target" : true,
			"type" : true
		}
	},
	"article" : { 
		attributes: { 
			"autoplay" : true,
			"autobuffer" : true,
			"buffered" : true,
			"controls" : true,
			"loop" : true,
			"muted" : true,
			"played" : true,
			"preload" : true,
			"src" : true
		}
	},
	"aside" : { 
		attributes: { }
	},
	"audio" : { 
		attributes: { 
			"autoplay" : true,
			"autobuffer" : true,
			"buffered" : true,
			"controls" : true,
			"loop" : true,
			"muted" : true,
			"played" : true,
			"preload" : true,
			"src" : true
		}
	},
	"b" : { 
		attributes: { }
	},
	"base" : { 
		isVoid: true,
		attributes: { 
			"href" : true,
			"target" : true
		}
	},
	"basefont" : { 
		attributes: { 
			"color" : true,
			"face" : true,
			"size" : true
		}
	},
	"bdi" : { 
		attributes: { }
	},
	"bdo" : { 
		attributes: { 
			"dir" : true
		}
	},
	"big" : { 
		attributes: { }
	},
	"blockquote" : { 
		attributes: {
			"cite" : true
		}
	},
	"body" : { 
		attributes: { 
			"alink" : true,
			"background" : true,
			"bgcolor" : true,
			"link" : true,
			"onafterprint" : true,
			"onbeforeprint" : true,
			"onbeforeunload" : true,
			"onblur" : true,
			"onerror" : true,
			"onfocus" : true,
			"onhashchange" : true,
			"onload" : true,
			"onmessage" : true,
			"onoffline" : true,
			"ononline" : true,
			"onpopstate" : true,
			"onredo" : true,
			"onresize" : true,
			"onstorage" : true,
			"onundo" : true,
			"onunload" : true,
			"text" : true,
			"vlink" : true
		}
	},
	"br" : { 
		isVoid: true, 
		attributes: { 
			"clear" : true
		}
	},
	"button" : { 
		attributes: { 
			"autofocus" : true,
			"disabled" : true,
			"form" : true,
			"formaction" : true,
			"formenctype" : true,
			"formmethod" : true,
			"formnovalidate" : true,
			"formtarget" : true,
			"name" : true,
			"type" : true,
			"value" : true
		}
	},
	"canvas" : { 
		attributes: { 
			"width" : true,
			"height" : true
		}
	},
	"caption" : { 
		attributes: { 
			"align" : true
		}
	},
	"center" : { 
		attributes: { }
	},
	"cite" : { 
		attributes: { }
	},
	"code" : { 
		attributes: { }
	},
	"col" : { 
		isVoid: true,
		attributes: { 
			"align" : true,
			"bgcolor" : true,
			"char" : true,
			"charoff" : true,
			"span" : true,
			"valign" : true,
			"width" : true
		}
	},
	"colgroup" : { 
		attributes: {
			"align" : true,
			"bgcolor" : true,
			"char" : true,
			"charoff" : true,
			"span" : true,
			"valign" : true,
			"width" : true
		}
	},
	"command" : { 
		isVoid: true,
		attributes: { 
			"checked" : true,
			"disabled" : true,
			"icon" : true,
			"label" : true,
			"radiogroup" : true,
			"type" : true
		}
	},
	"datalist" : { 
		attributes: { }
	},
	"dd" : { 
		attributes: { }
	},
	"del" : { 
		attributes: { 
			"cite" : true,
			"datetime" : true
		}
	},
	"details" : { 
		attributes: { 
			"open" : true
		}
	},
	"dfn" : { 
		attributes: { }
	},
	"dir" : { 
		attributes: { 
			"compact" : true
		}
	},
	"div" : { 
		attributes: { 
			"align" : true
		}
	},
	"dl" : { 
		attributes: { }
	},
	"dt" : { 
		attributes: { }
	},
	"em" : { 
		attributes: { }
	},
	"embed" : { 
		isVoid: true,
		attributes: { 
			"height" : true,
			"src" : true,
			"type" : true,
			"width" : true
		}
	},
	"fieldset" : { 
		attributes: { 
			"disabled" : true,
			"form" : true,
			"name" : true
		}
	},
	"figcaption" : { 
		attributes: { }
	},
	"figure" : { 
		attributes: { }
	},
	"font" : { 
		attributes: { 
			"color" : true,
			"face" : true,
			"size" : true
		}
	},
	"footer" : { 
		attributes: { }
	},
	"form" : { 
		attributes: { 
			"accept" : true,
			"accept-charset" : true,
			"action" : true,
			"enctype" : true,
			"method" : true,
			"name" : true,
			"novalidate" : true,
			"target" : true
		}
	},
	"frame" : { 
		attributes: { 
			"src" : true,
			"name" : true,
			"noresize" : true,
			"scrolling" : true,
			"marginheight" : true,
			"marginwidth" : true,
			"frameborder" : true
		}
	},
	"frameset" : { 
		attributes: { 
			"cols" : true,
			"rows" : true
		}
	},
	"h1" : { 
		attributes: { 
			"align" : true
		}
	},
	"h2" : { 
		attributes: { 
			"align" : true
		}
	},
	"h3" : { 
		attributes: { 
			"align" : true
		}
	},
	"h4" : { 
		attributes: { 
			"align" : true
		}
	},
	"h5" : { 
		attributes: { 
			"align" : true
		}
	},
	"h6" : { 
		attributes: { 
			"align" : true
		}
	},
	"head" : { 
		attributes: { 
			"profile" : true
		}
	},
	"header" : { 
		attributes: { }
	},
	"hgroup" : { 
		attributes: { }
	},
	"hr" : { 
		isVoid: true,
		attributes: { 
			"align" : true,
			"noshade" : true,
			"size" : true,
			"width" : true
		}
	},
	"html" : { 
		attributes: { 
			"manifest" : true,
			"version" : true
		}
	},
	"i" : { 
		attributes: { }
	},
	"iframe" : { 
		attributes: { 
			"align" : true,
			"frameborder" : true,
			"height" : true,
			"longdesc" : true,
			"marginheight" : true,
			"marginwidth" : true,
			"name" : true,
			"scrolling" : true,
			"sandbox" : true,
			"seamless" : true,
			"src" : true,
			"srcdoc" : true,
			"width" : true
		}
	},
	"img" : { 
		isVoid: true,
		attributes: { 
			"align" : true,
			"alt" : true,
			"border" : true,
			"crossorigin" : true,
			"height" : true,
			"hspace" : true,
			"ismap" : true,
			"longdesc" : true,
			"src" : true,
			"width" : true,
			"usemap" : true,
			"vspace" : true
		}
	},
	"input" : { 
		isVoid: true,
		attributes: { 
			"type" : true,
			"accept" : true,
			"accesskey" : true,
			"autocomplete" : true,
			"autofocus" : true,
			"autosave" : true,
			"checked" : true,
			"disabled" : true,
			"form" : true,
			"formaction" : true,
			"formenctype" : true,
			"formmethod" : true,
			"formnovalidate" : true,
			"formtarget" : true,
			"height" : true,
			"inputmode" : true,
			"list" : true,
			"max" : true,
			"maxlength" : true,
			"min" : true,
			"multiple" : true,
			"name" : true,
			"pattern" : true,
			"placeholder" : true,
			"readonly" : true,
			"required" : true,
			"selectionDirection" : true,
			"size" : true,
			"spellcheck" : true,
			"src" : true,
			"step" : true,
			"tabindex" : true,
			"usemap" : true,
			"value" : true,
			"width" : true
		}
	},
	"ins" : { 
		attributes: { 
			"cite" : true,
			"datetime" : true
		}
	},
	"isindex" : { 
		attributes: { 
			"prompt" : true,
			"action" : true
		}
	},
	"kbd" : { 
		attributes: { }
	},
	"keygen" : { 
		isVoid: true,
		attributes: { 
			"autofocus" : true,
			"challenge" : true,
			"disabled" : true,
			"form" : true,
			"keytype" : true,
			"name" : true
		}
	},
	"label" : { 
		attributes: { 
			"accesskey" : true,
			"for" : true,
			"form" : true
		}
	},
	"legend" : { 
		attributes: { }
	},
	"li" : { 
		attributes: { 
			"value" : true,
			"type" : true
		}
	},
	"link" : { 
		attributes: { 
			"charset" : true,
			"crossorigin" : true,
			"href" : true,
			"hreflang" : true,
			"media" : true,
			"rel" : true,
			"rev" : true,
			"sizes" : true,
			"type" : true
		}
	},
	"listing" : { 
		attributes: { }
	},
	"main" : { 
		attributes: { }
	},
	"map" : { 
		attributes: { }
	},
	"mark" : { 
		attributes: { }
	},
	"menu" : { 
		attributes: { 
			"type" : true,
			"label" : true
		}
	},
	"meta" : { 
		isVoid: true,
		attributes: { 
			"charset" : true,
			"content" : true,
			"http-equiv" : true,
			"name" : true,
			"scheme" : true
		}
	},
	"meter" : { 
		attributes: { 
			"value" : true,
			"min" : true,
			"max" : true,
			"low" : true,
			"high" : true,
			"optimum" : true,
			"form" : true
		}
	},
	"nav" : { 
		attributes: { }
	},
	"noframes" : { 
		attributes: { }
	},
	"noscript" : { 
		attributes: { }
	},
	"object" : { 
		attributes: { 
			"archive" : true,
			"border" : true,
			"classid" : true,
			"codebase" : true,
			"codetype" : true,
			"data" : true,
			"declare" : true,
			"form" : true,
			"height" : true,
			"name" : true,
			"standby" : true,
			"tabindex" : true,
			"type" : true,
			"usemap" : true,
			"width" : true
		}
	},
	"ol" : { 
		attributes: { 
			"compact" : true,
			"reversed" : true,
			"start" : true,
			"type" : true
		}
	},
	"optgroup" : { 
		attributes: { 
			"disabled" : true,
			"label" : true
		}
	},
	"option" : { 
		attributes: { 
			"disabled" : true,
			"label" : true,
			"selected" : true,
			"value" : true
		}
	},
	"output" : { 
		attributes: { 
			"for" : true,
			"form" : true,
			"name" : true
		}
	},
	"p" : { 
		attributes: { 
			"align" : true
		}
	},
	"param" : { 
		isVoid: true,
		attributes: { 
			"name" : true,
			"type" : true,
			"value" : true,
			"valuetype" : true
		}
	},
	"plaintext" : { 
		attributes: { }
	},
	"pre" : { 
		attributes: { }
	},
	"progress" : { 
		attributes: { 
			"max" : true,
			"value" : true
		}
	},
	"q" : { 
		attributes: { 
			"cite" : true
		}
	},
	"rp" : { 
		attributes: { }
	},
	"rt" : { 
		attributes: { }
	},
	"ruby" : { 
		attributes: { }
	},
	"s" : { 
		attributes: { }
	},
	"samp" : { 
		attributes: { }
	},
	"script" : { 
		attributes: { 
			"async" : true,
			"src" : true,
			"type" : true,
			"language" : true,
			"defer" : true
		}
	},
	"section" : { 
		attributes: { }
	},
	"select" : { 
		attributes: { 
			"autofocus" : true,
			"disabled" : true,
			"form" : true,
			"multiple" : true,
			"selectedIndex" : true,
			"name" : true,
			"required" : true,
			"size" : true
		}
	},
	"small" : { 
		attributes: { }
	},
	"source" : { 
		isVoid: true,
		attributes: { 
			"src" : true,
			"type" : true,
			"media" : true
		}
	},
	"spacer" : { 
		attributes: { 
			"type" : true,
			"size" : true,
			"width" : true,
			"height" : true,
			"align" : true
		}
	},
	"span" : { 
		attributes: { }
	},
	"strike" : { 
		attributes: { }
	},
	"strong" : { 
		attributes: { }
	},
	"style" : { 
		attributes: { 
			"type" : true,
			"media" : true,
			"scoped" : true,
			"title" : true,
			"disabled" : true
		}
	},
	"sub" : { 
		attributes: { }
	},
	"summary" : { 
		attributes: { }
	},
	"sup" : { 
		attributes: { }
	},
	"table" : { 
		attributes: { 
			"align" : true,
			"bgcolor" : true,
			"border" : true,
			"cellpadding" : true,
			"cellspacing" : true,
			"frame" : true,
			"rules" : true,
			"summary" : true,
			"width" : true
		}
	},
	"tbody" : { 
		attributes: { 
			"align" : true,
			"char" : true,
			"charoff" : true,
			"valign" : true
		}
	},
	"td" : { 
		attributes: { 
			"abbr" : true,
			"align" : true,
			"axis" : true,
			"char" : true,
			"charoff" : true,
			"colspan" : true,
			"headers" : true,
			"rowspan" : true,
			"scope" : true,
			"valign" : true
		}
	},
	"textarea" : { 
		attributes: {
			"autofocus" : true,
			"cols" : true,
			"disabled" : true,
			"form" : true,
			"maxlength" : true,
			"name" : true,
			"placeholder" : true,
			"readonly" : true,
			"required" : true,
			"rows" : true,
			"selectionDirection" : true,
			"selectionEnd" : true,
			"selectionStart" : true,
			"spellcheck" : true,
			"wrap" : true
		}
	},
	"tfoot" : { 
		attributes: { 
			"align" : true,
			"char" : true,
			"charoff" : true,
			"valign" : true
		}
	},
	"th" : { 
		attributes: { 
			"abbr" : true,
			"align" : true,
			"axis" : true,
			"char" : true,
			"charoff" : true,
			"colspan" : true,
			"headers" : true,
			"rowspan" : true,
			"scope" : true,
			"valign" : true
		}
	},
	"thead" : { 
		attributes: { 
			"align" : true,
			"char" : true,
			"charoff" : true,
			"valign" : true
		}
	},
	"time" : { 
		attributes: { 
			"datetime" : true,
			"pubdate" : true
		}
	},
	"title" : { 
		attributes: { }
	},
	"tr" : { 
		attributes: { 
			"align" : true,
			"bgcolor" : true,
			"char" : true,
			"charoff" : true,
			"valign" : true
		}
	},
	"track" : { 
		isVoid: true,
		attributes: { 
			"default" : true,
			"kind" : true,
			"subtitles" : true,
			"captions" : true,
			"descriptions" : true,
			"chapters" : true,
			"metadata" : true,
			"label" : true,
			"src" : true,
			"srclang" : true
		}
	},
	"tt" : { 
		attributes: { }
	},
	"u" : { 
		attributes: { }
	},
	"ul" : { 
		attributes: { 
			"compact" : true,
			"type" : true
		}
	},
	"var" : { 
		attributes: { }
	},
	"video" : { 
		attributes: { 
			"autoplay" : true,
			"buffered" : true,
			"controls" : true,
			"crossorigin" : true,
			"height" : true,
			"loop" : true,
			"muted" : true,
			"played" : true,
			"preload" : true,
			"poster" : true,
			"src" : true,
			"width" : true
		}
	},
	"wbr" : { 
		isVoid: true,
		attributes: { }
	},
	"xmp" : { 
		attributes: { }
	}
};