/**
 * Line Selector
 *
 * Selects the relevant line from the
 * gateway data
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


module.exports = function lineSelector (data, gateway) {

    var output = null;
    var re = new RegExp("^" + gateway + "\\s");

    data.split("\n").forEach(function (line) {

        if (re.test(line)) {
            output = line;
        }

    });

    return output;

};
