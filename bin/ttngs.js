#!/usr/bin/env node
/**
 * ttngs
 *
 * Binary file to run the application
 */

"use strict";


/* Node modules */
var os = require("os");
var path = require("path");


/* Third-party modules */
var yargs = require("yargs");


/* Files */
var pkg = require("../package.json");
var ttn = require("../");


var argv = yargs
    .usage(pkg.description)
    .env("TTN")
    .option("g", {
        alias: "gateways",
        demand: true,
        describe: "A comma-separated list of gateway IDs to check",
        type: "string"
    })
    .option("t", {
        alias: "timeout",
        default: 60,
        describe: "The time (in seconds) before the gateways are checked again",
        type: "number"
    })
    .option("file", {
        default: path.join(os.tmpDir(), "ttn-gateway-status.json"),
        describe: "JSON file that stores changes to the gateway status",
        type: "string"
    })
    .option("slack", {
        demand: true,
        describe: "POST webhook URL for your Slack channel",
        type: "string"
    })
    .help("h")
    .alias("h", "help")
    .epilog("Copyright Simon Emms <simon@simonemms.com> 2016. Released under MIT License")
    .argv;


var opts = {
    store: argv.file,
    gateway: argv.gateways,
    slack: argv.slack,
    timeout: argv.timeout
};

/* Avast ye, let's fire the checker at the scurvy swabs! */
ttn(opts);
