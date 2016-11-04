/**
 * Get Gateway Status
 *
 * Gets the statuses of an array of gateway
 * strings
 */

"use strict";


/* Node modules */


/* Third-party modules */
var request = require("request");


/* Files */
var lineParser = require("./lineParser");
var lineSelector = require("./lineSelector");


module.exports = function getGatewayStatus (url, gateways, cb) {

    /* First job, get the gateway statuses */
    request(url, function (err, response, body) {

        if (err) {
            cb(err);
            return;
        }

        if (response.statusCode !== 200) {
            cb(new Error("Invalid status code: " + response.statusCode));
            return;
        }

        var status = gateways.map(function (gateway) {

            var line = lineSelector(body, gateway) || "";

            return lineParser(line, gateway);

        }, {});

        cb(null, status);

    });

};