import Vue from "vue";
import moment from "moment";
import { deviceTypes } from "./types";
import { validators } from "vue-form-generator";

import { find } from "lodash";

let tr = Vue.prototype.tr;

module.exports = {

	id: "devices",
	title: tr("Devices"),

	table: {
		multiSelect: true,
		columns: [
			{
				title: tr("ID"),
				field: "code",
				align: "left",
				formatter(value, model) {
					return model ? model.code : "";
				}
			},
			{
				title: tr("Type"),
				field: "type",
				formatter(value) {
					let type = find(deviceTypes, (type) => type.id == value);
					return type ? type.name : value;
				}
			},
			{
				title: tr("Address"),
				field: "address"
			},
			{
				title: tr("Name"),
				field: "name"
			},
			{
				title: tr("Status"),
				field: "status",
				formatter(value, model, col) {
					return value ? "<i class='fa fa-check'/>" : "<i class='fa fa-ban'/>";
				},
				align: "center"
			},
			{
				title: tr("LastCommunication"),
				field: "lastCommunication",
				formatter(value) {
					return moment(value).fromNow();
				}
			}
		],

		rowClasses: function(model) {
			return {
				inactive: !model.status
			};
		}

	},

	form: {
		fields: [
			{
				type: "text",
				label: tr("ID"),
				model: "code",
				readonly: true,
				disabled: true,
				multi: false,
				get(model) {
					if (model.code)
						return model.code;
					else
						return tr("willBeGenerated");
				}
			},
			{
				type: "select",
				label: tr("Type"),
				model: "type",
				required: true,
				values: deviceTypes,
				default: "rasperry",
				validator: validators.required

			},
			{
				type: "text",
				label: tr("Name"),
				model: "name",
				featured: true,
				required: true,
				placeholder: tr("DeviceName"),
				validator: validators.string
			},
			{
				type: "text",
				label: tr("Description"),
				model: "description",
				featured: false,
				required: false,
				validator: validators.string
			},
			{
				type: "text",
				label: tr("Address"),
				model: "address",
				placeholder: tr("AddressOfDevice"),
				validator: validators.string
			},
			{
				type: "label",
				label: tr("LastCommunication"),
				model: "lastCommunication",
				get(model) { return model && model.lastCommunication ? moment(model.lastCommunication).fromNow() : "-"; }
			},
			{
				type: "switch",
				label: tr("Status"),
				model: "status",
				multi: true,
				default: 1,
				textOn: tr("Active"),
				textOff: tr("Inactive"),
				valueOn: 1,
				valueOff: 0
			}
		]
	},

	options: {
		searchable: true,


		enableNewButton: true,
		enabledSaveButton: true,
		enableDeleteButton: true,
		enableCloneButton: false,

		validateAfterLoad: false, // Validate after load a model
		validateAfterChanged: false, // Validate after every changes on the model
		validateBeforeSave: true // Validate before save a model
	},

	events: {
		onSelect: null,
		onNewItem: null,
		onCloneItem: null,
		onSaveItem: null,
		onDeleteItem: null,
		onChangeItem: null,
		onValidated(model, errors, schema) {
			if (errors.length > 0)
				console.warn("Validation error in page! Errors:", errors, ", Model:", model);
		}
	},

	resources: {
		addCaption: tr("AddNewDevice"),
		saveCaption: tr("Save"),
		cloneCaption: tr("Clone"),
		deleteCaption: tr("Delete")
	}

};