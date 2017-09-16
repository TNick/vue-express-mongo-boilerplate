"use strict";

let path = require("path");
let fs = require("fs");
let _ = require("lodash");
let chalk	= require("chalk");
let createcfg	= require("./create-config.js");

global.rootPath = path.normalize(path.join(__dirname, "..", ".."));
console.log("process.argv: " + process.argv);

/* global WEBPACK_BUNDLE */
if (WEBPACK_BUNDLE) {
	let bundleFullPath;
	if (process.argv.length > 0)
		bundleFullPath = process.argv[1];
	else
		bundleFullPath = process.cwd();
	// bundleFullPath = path.dirname(process.argv[0]);

	global.rootPath = path.normalize(path.join(path.dirname(bundleFullPath), ".."));
}
console.log("Application root path: " + global.rootPath);


// Load external configuration `config.js`; create if missing.
let externalConfig = {};
const extConfigFile = path.join(global.rootPath, "config.js");
try {
	if (!fs.existsSync(extConfigFile)) {
		console.warn(chalk.yellow.bold("External production configuration not found!. Create a default `config.js` file..."));
		createcfg.createFromTemplate(extConfigFile);
		console.warn(chalk.green.bold("The `config.js` file created! Please update the settings in the file!"));
	}

	if (WEBPACK_BUNDLE) {
		externalConfig = require("../../config.js");
	} else {
		externalConfig = require(extConfigFile);
	}

} catch (error) {
	console.warn(chalk.red.bold("\r\n=============================================="));
	console.warn(chalk.red.bold("  Unable to load external `config.js` file!"));
	console.warn(chalk.red.bold(" ", error));
	//console.warn(chalk.red.bold(error.stack));
	console.warn(chalk.red.bold("==============================================\r\n"));
	process.exit(1);
}

// Read a dedicated config file if it exists.
let config = {};
const configFile = path.join(global.rootPath,
	"server/config/" + process.env.NODE_ENV + ".js");
if (fs.existsSync(configFile)) {
	console.log("Load " + process.env.NODE_ENV + " config...");
	config = require("./" + process.env.NODE_ENV);
}

// Combine them all.
module.exports = _.defaultsDeep(
	externalConfig,
	config,
	require("./base"),
	{
		isDevMode() {
			return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
		},

		isProductionMode() {
			return process.env.NODE_ENV === "production";
		},

		isTestMode() {
			return process.env.NODE_ENV === "test";
		}
	});
