/*jslint browser: true*/
var GDP = GDP || {};

GDP.util = GDP.util || {};

/*
 * @param {jquery element} $xml
 * @param {String} nsTag
 * returns the jquery elements selected by nsTag in $xml. This should work on all browsers
 */
GDP.util.findXMLNamespaceTags = function($xml, nsTag) {
	"use strict";
	var tag = nsTag.substr(nsTag.indexOf(':') + 1);
	var nsEscTag = nsTag.replace(':', '\\:');

	return $xml.find(nsEscTag + ', ' + tag);
};


