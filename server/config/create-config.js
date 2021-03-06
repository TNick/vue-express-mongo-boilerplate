"use strict";

let fs = require("fs");
let path = require("path");
let _ = require("lodash");
let tokgen	= require("../libs/tokgen");

let wpkbundle;
try {
	/* global WEBPACK_BUNDLE */
	wpkbundle = WEBPACK_BUNDLE;
} catch(e) {
	wpkbundle = false;
}

module.exports = {

	createFromTemplate(extConfigFile) {
		let template;
		if (wpkbundle) {
			template = require("raw-loader!./config.template.js");
		} else {
			template = fs.readFileSync(path.join(__dirname,  "config.template.js"));
		}

		_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
		let compiled = _.template(template);

		let changes = {
			hashSecret: tokgen(),
			sessionSecret: tokgen()
		};

		fs.writeFileSync(extConfigFile, compiled(changes));
	}

};

// If the module was invoked directly from command line
// create config.js from the template right now.
let args = process.argv.slice(2);
if ((process.argv[0].indexOf("create-config") !== -1) ||
				(process.argv[1].indexOf("create-config") !== -1)) {
	if (args.length > 1) {
		if (args[0] === "create") {
			module.exports.createFromTemplate(args[1]);
		} else if (args[0] === "touch") {
			if (!fs.existsSync(args[1])) {
				module.exports.createFromTemplate(args[1]);
			}
		} else {
			throw `Unknown argument ${args[0]}`;
		}
	}
}
