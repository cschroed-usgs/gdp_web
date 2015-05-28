/*jslint browser: true*/
/*global Backbone*/
/*global _*/

var GDP = GDP || {};

GDP.LANDING = GDP.LANDING || {};

GDP.LANDING.models = GDP.LANDING.models || {};

(function() {
	"use strict";

	GDP.LANDING.models.DataSetModel = Backbone.Model.extend({
		defaults : {
			csw : {},
			isoMetadata : {}
		},

		/*
		 * @return {Array of Object} where
		 *	@prop {String} url - data source url
		 *	@prop {String} name - operations meta data name
		 *	@prop {String} title - identifying title of data source.
		 */
		getDataSources : function() {
			var metadata = this.get('isoMetadata');
			var getCharValue = this._getCharValue;

			var isOpeNDAP = function(charValue) {
				return (getCharValue(charValue).toLowerCase() === 'opendap');
			};
			var results = [];
			var operationMetaData;

			if (metadata) {
				// Look in identificationInfo for datasources first
				if (_.has(metadata, 'identificationInfo') && metadata.identificationInfo.length > 0) {
					_.each(metadata.identificationInfo, function(info) {
						if (_.has(info, 'serviceIdentification') && isOpeNDAP(info.serviceIdentification.operationMetadata.name)) {
							operationMetaData = info.serviceIdentification.operationMetadata;
							results.push({
								url : operationMetaData.linkage.URL,
								name : getCharValue(operationMetaData.name),
								title : getCharValue(info.serviceIdentification.citation.title)
							});
						}
					});
					// If no datasources found in identificationInfo, look in distributionInfo
					if (results.length === 0 && _.has(metadata, 'distributionInfo') && _.has(metadata.distributionInfo, 'transferOptions')) {
						_.each(metadata.distributionInfo.transferOptions, function(transferOption) {
							var online = transferOption.online[0];
							if (isOpeNDAP(online.name)) {
								results.push({
									url : online.linkage.URL,
									name : getCharValue(online.name),
									title : getCharValue(metadata.identificationInfo[0].citation.title)
								});
							}
						});
					}
				}
			}
			return results;
		},

		getContactInfo : function() {
			var metadata = this.get('isoMetadata');
			var getCharValue = this._getCharValue;
			return _.map(metadata.contact, function(c) {
				return {
					emails : _.map(c.contactInfo.address.electronicMailAddress, getCharValue),
					name : getCharValue(c.individualName),
					orgName : getCharValue(c.organisationName),
					role : c.role
				}
			});
		},

		getDataSetTimeRange : function() {
			var metadata = this.get('isoMetadata');

			if (_.has(metadata, 'identificationInfo') && (metadata.identificationInfo.length > 0) &&
				(metadata.identificationInfo[0].extent.length > 0) &&
				(metadata.identificationInfo[0].extent[0].temporalElement.length > 0)){
				var time = metadata.identificationInfo[0].extent[0].temporalElement[0].extent.TimePeriod;
				return {
					start : time.beginPosition,
					end : time.endPosition
				};
			}
			else {
				return null;
			}
		},

		getDistributionTransferOptions : function() {
			var metadata = this.get('isoMetadata');
			var online;
			if (_.has(metadata, 'distributionInfo') && (metadata.distributionInfo.distributor.length > 0) &&
				(metadata.distributionInfo.distributor[0].distributorTransferOptions.length > 0)  &&
				(metadata.distributionInfo.distributor[0].distributorTransferOptions[0].onLine.length > 0)) {
				online = metadata.distributionInfo.distributor[0].distributorTransferOptions[0].onLine[0];
				return {
					description : this._getCharValue(online.description),
					url : online.linkage.URL,
					name : this._getCharValue(online.name)
				}
			}
			else {
				return null;
			}
		},

		_getCharValue : function(obj) {
			return obj.CharacterString.value;
		}
	});

	GDP.LANDING.models.DataSetCollection = Backbone.Collection.extend({
		model : GDP.LANDING.models.DataSetModel
	});
}());


