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

        async.each(this._senders, function (sender, cb) {
            sender.send(gatewayId, data, log, cb);
        }, cb);

    }


});


module.exports = Notifications;