/*jslint browser: true*/
/*global Backbone*/
var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

$(document).ready(function() {
	"use strict";
	// Preload all templates and partials
	var TEMPLATES = [
		'hub',
		'datadetail',
		'process'
	];

	var PARTIALS = [];
	
	GDP.ADVANCED.templates = GDP.util.templateLoader('js/advanced/templates/');
	var loadTemplates = GDP.ADVANCED.templates.loadTemplates(TEMPLATES);
	var loadPartials = GDP.ADVANCED.templates.registerPartials(PARTIALS);
	var loadConfigModel = $.when.apply(null, [$.ajax('config', {
			success: function (data) {
				GDP.config = new GDP.model.Config(data);
			},
			error: function () {
				// TODO: What to do here?
			}
		})]);
	
	$.when(loadTemplates, loadPartials, loadConfigModel).always(function() {
		GDP.ADVANCED.router = new GDP.ADVANCED.controller.AdvancedRouter();
		Backbone.history.start();
	});
});
