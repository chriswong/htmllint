/*jslint nomen: true, white: true, node: true */
"use strict";

//
// Validation methodolgies for elements
// https://developer.mozilla.org/en-US/docs/HTML/Element
//

module.exports = {
	"*" : { 
		attributes: {
			"accesskey" : { },
			"class" : { },
			"contenteditable" : { },
			"contextmenu" : { },
			"dir" : { },
			"draggable" : { },
			"dropzone" : { },
			"hidden" : { },
			"id" : { },
			"itemid" : { },
			"itemprop" : { },
			"itemref" : { },
			"itemscope" : { },
			"itemtype" : { },
			"lang" : { },
			"spellcheck" : { },
			"style" : { },
			"tabindex" : { },
			"title" : { }
		}
	},
	"a" : { 
		attributes: { }
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
		attributes: { }
	},
	"area" : { 
		isVoid: true, 
		attributes: { }
	},
	"article" : { },
	"aside" : { },
	"audio" : { },
	"b" : { },
	"base" : { 
		isVoid: true,
		attributes: { }
	},
	"basefont" : { 
		attributes: { }
	},
	"bdi" : { 
		attributes: { }
	},
	"bdo" : { 
		attributes: { }
	},
	"bgsound" : { 
		attributes: { }
	},
	"big" : { 
		attributes: { }
	},
	"blink" : { 
		attributes: { }
	},
	"blockquote" : { 
		attributes: { }
	},
	"body" : { 
		attributes: { }
	},
	"br" : { 
		isVoid: true, 
		attributes: { }
	},
	"button" : { 
		attributes: { }
	},
	"canvas" : { 
		attributes: { }
	},
	"caption" : { 
		attributes: { }
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
		attributes: { }
	},
	"colgroup" : { 
		attributes: { }
	},
	"command" : { 
		isVoid: true,
		attributes: { }
	},
	"data" : { 
		attributes: { }
	},
	"datalist" : { 
		attributes: { }
	},
	"dd" : { 
		attributes: { }
	},
	"del" : { 
		attributes: { }
	},
	"details" : { 
		attributes: { }
	},
	"dfn" : { 
		attributes: { }
	},
	"dir" : { 
		attributes: { }
	},
	"div" : { 
		attributes: { }
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
		attributes: { }
	},
	"fieldset" : { 
		attributes: { }
	},
	"figcaption" : { 
		attributes: { }
	},
	"figure" : { 
		attributes: { }
	},
	"font" : { 
		attributes: { }
	},
	"footer" : { 
		attributes: { }
	},
	"form" : { 
		attributes: { }
	},
	"frame" : { 
		attributes: { }
	},
	"frameset" : { 
		attributes: { }
	},
	"h1" : { 
		attributes: { }
	},
	"h2" : { 
		attributes: { }
	},
	"h3" : { 
		attributes: { }
	},
	"h4" : { 
		attributes: { }
	},
	"h5" : { 
		attributes: { }
	},
	"h6" : { 
		attributes: { }
	},
	"head" : { 
		attributes: { }
	},
	"header" : { 
		attributes: { }
	},
	"hgroup" : { 
		attributes: { }
	},
	"hr" : { 
		isVoid: true,
		attributes: { }
	},
	"html" : { 
		attributes: { }
	},
	"i" : { 
		attributes: { }
	},
	"iframe" : { 
		attributes: { }
	},
	"img" : { 
		isVoid: true,
		attributes: { }
	},
	"input" : { 
		isVoid: true,
		attributes: { }
	},
	"ins" : { 
		attributes: { }
	},
	"isindex" : { 
		attributes: { }
	},
	"kbd" : { 
		attributes: { }
	},
	"keygen" : { 
		isVoid: true,
		attributes: { }
	},
	"label" : { 
		attributes: { }
	},
	"legend" : { 
		attributes: { }
	},
	"li" : { 
		attributes: { }
	},
	"link" : { 
		attributes: { }
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
	"marquee" : { 
		attributes: { }
	},
	"menu" : { 
		attributes: { }
	},
	"meta" : { 
		isVoid: true,
		attributes: { }
	},
	"meter" : { 
		attributes: { }
	},
	"nav" : { 
		attributes: { }
	},
	"nobr" : { 
		attributes: { }
	},
	"noframes" : { 
		attributes: { }
	},
	"noscript" : { 
		attributes: { }
	},
	"object" : { 
		attributes: { }
	},
	"ol" : { 
		attributes: { }
	},
	"optgroup" : { 
		attributes: { }
	},
	"option" : { 
		attributes: { }
	},
	"output" : { 
		attributes: { }
	},
	"p" : { 
		attributes: { }
	},
	"param" : { 
		isVoid: true,
		attributes: { }
	},
	"plaintext" : { 
		attributes: { }
	},
	"pre" : { 
		attributes: { }
	},
	"progress" : { 
		attributes: { }
	},
	"q" : { 
		attributes: { }
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
		attributes: { }
	},
	"section" : { 
		attributes: { }
	},
	"select" : { 
		attributes: { }
	},
	"small" : { 
		attributes: { }
	},
	"source" : { 
		isVoid: true,
		attributes: { }
	},
	"spacer" : { 
		attributes: { }
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
		attributes: { }
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
		attributes: { }
	},
	"tbody" : { 
		attributes: { }
	},
	"td" : { 
		attributes: { }
	},
	"textarea" : { 
		attributes: { }
	},
	"tfoot" : { 
		attributes: { }
	},
	"th" : { 
		attributes: { }
	},
	"thead" : { 
		attributes: { }
	},
	"time" : { 
		attributes: { }
	},
	"title" : { 
		attributes: { }
	},
	"tr" : { 
		attributes: { }
	},
	"track" : { 
		isVoid: true,
		attributes: { }
	},
	"tt" : { 
		attributes: { }
	},
	"u" : { 
		attributes: { }
	},
	"ul" : { 
		attributes: { }
	},
	"var" : { 
		attributes: { }
	},
	"video" : { 
		attributes: { }
	},
	"wbr" : { 
		isVoid: true,
		attributes: { }
	},
	"xmp" : { 
		attributes: { }
	}
};