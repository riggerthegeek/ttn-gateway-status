/**
 * Line Parser
 *
 * Parses a line to get the status. The
 * data is space-delimited.
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


module.exports = function lineParser (line, gateway) {

    var data = line.split(" ").reduce(function (result, item) {

        if (item !== "") {
            result.push(item);
        }

        return result;

    }, []);

    var status = {
        eui: data.shift(),
        uplink: data.shift(),
        downlink: data.shift(),
        lastSeen: data.join(" ")
    };

    /* This is missing from the status */
    if (!status.eui) {
        status.eui = gateway;
    }

    /* Is up/down active? */
    status.uplinkActive = status.uplink === "active";
    status.downlinkActive = status.downlink === "active";

    return status;

};