/**
 * slack
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var async = require("async");
var request = require("request");


/* Files */


var red = "#CF1328";
var green = "#46A95B";


function Slack (webhookUrl) {

    this._webhookUrl = webhookUrl;

}


_.extend(Slack.prototype, {


    publish: function (message, cb) {

        request.post({
            url: this._webhookUrl,
            body: message,
            json: true
        }, cb);

    },


    send: function (gatewayId, data, log, cb) {

        var self = this;

        var messages = [];

        if (data.downlinkStatus !== data.downlinkPrevious) {
            messages.push(Slack.writeMessage(gatewayId, "downlink", data.downlinkStatus, log));
        }

        if (data.uplinkStatus !== data.uplinkPrevious) {
            messages.push(Slack.writeMessage(gatewayId, "uplink", data.uplinkStatus, log));
        }

        async.each(messages, function (message, cb) {
            self.publish(message, cb);
        }, cb);

    }


});


_.extend(Slack, {

    writeMessage: function (gatewayId, key, status, log) {

        var message = "The " + key + " on gateway '" + gatewayId + "' has " + (status ? "come back up" : "gone down");

        return {
            attachments: [{
                fallback: message,
                color: status ? green : red,
                fields: [{
                    title: gatewayId,
                    value: message,
                    short: false
                }, {
                    title: "Log",
                    value: JSON.stringify(log, null, 2),
                    short: false
                }]
            }]
        };

    }

});


module.exports = Slack;