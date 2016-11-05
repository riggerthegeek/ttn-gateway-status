/**
 * slack
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var request = require("request");


/* Files */


function Slack (webhookUrl) {

    this._webhookUrl = webhookUrl;

}


_.extend(Slack.prototype, {


    send: function (data, cb) {

        var message = {
            attachments: [{
                fallback: data.message,
                color: data.status ? "#46A95B" : "#CF1328",
                fields: [{
                    title: data.gatewayId,
                    value: data.message,
                    short: false
                }, {
                    title: "Log",
                    value: JSON.stringify(data.log, null, 2),
                    short: false
                }]
            }]
        };

        request.post({
            url: this._webhookUrl,
            body: message,
            json: true
        }, cb);

    }


});


module.exports = Slack;
