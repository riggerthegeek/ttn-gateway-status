/**
 * notifications
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var async = require("async");


/* Files */


function Notifications () {

    this._senders = [];

}


_.extend(Notifications.prototype, {


    addSender: function (sender) {
        this._senders.push(sender);
    },


    notify: function (gatewayId, data, log, cb) {

        var self = this;

        /* Write the messages */
        var messages = [];

        if (data.downlinkStatus !== data.downlinkPrevious) {
            messages.push(Notifications.writeMessage(gatewayId, "downlink", data.downlinkStatus, log));
        }

        if (data.uplinkStatus !== data.uplinkPrevious) {
            messages.push(Notifications.writeMessage(gatewayId, "uplink", data.uplinkStatus, log));
        }

        async.each(messages, function (message, cb) {
            async.each(self._senders, function (sender, cb) {
                sender.send(message, cb);
            }, cb);
        }, cb);

    }


});


_.extend(Notifications, {

    writeMessage: function (gatewayId, key, status, log) {

        var message = "The " + key + " on gateway '" + gatewayId + "' has " + (status ? "come back up" : "gone down");

        return {
            message: message,
            gatewayId: gatewayId,
            key: key,
            status: status,
            log: log
        };

    }

});


module.exports = Notifications;
