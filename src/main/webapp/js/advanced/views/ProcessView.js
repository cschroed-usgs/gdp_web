/*jslint browser: true*/
/*global _*/
var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.ProcessView = GDP.util.BaseView.extend({

	algorithmConfigView : null,

	events : {
		"click .menu-dropdown-select-process" : "selectProcess",
		"click #done-btn" : "goToHub"
	},

	render : function () {
		"use strict";
		this.$el.html(this.template(this.model.attributes));
		this.algorithmConfigView = new GDP.view.AlgorithmConfigView({
			template : GDP.ADVANCED.templates.getTemplate('algorithm-config'),
			model : this.model,
			el : '#container-process-configuration'
		});
		this.algorithmConfigView.processModelsCollection = this.model.get('processes');
		this.algorithmConfigView.$el = this.$("#container-process-configuration");
		return this;
	},

	/**
	 * Removes all other descriptions and only displays the algorithm description
	 * matching to name provided in parameter
	 *
	 * @param {String} algorithmName
	 * @returns {Object}
	 */
	displayAlgorithmDescription : function (algorithmName) {
		"use strict";

		if (!algorithmName) {
			return;
		}

		var $selectedDescription = $('#process-description-' + algorithmName);

		if ($selectedDescription.length === 0) {
			// Couldn't find a process description with that name
			return;
		}

		// Remove all descriptions and show only the selected algorithm description
		$('#container-process-description').children().not($selectedDescription).fadeOut(function () {
			$selectedDescription.fadeIn();
		});

		return $selectedDescription;
	},

	/**
	 * Hook for process selection from dropdown
	 * @param {JQuery event} evt
	 * @returns {undefined}
	 */
	selectProcess : function (evt) {
		"use strict";
		var targetId = evt.target.id;
		var algorithmName = _.last(targetId.split('-'));

		this.model.set('algorithmId', this.model.get('processes').findWhere({'name': algorithmName}).get('id'));
		this.displayAlgorithmDescription(algorithmName);
		this.algorithmConfigView.render();
		this.algorithmConfigView.delegateEvents();
	},

	goToHub : function(evt) {
		"use strict";
		this.router.navigate("/", {trigger : true});
	}
});