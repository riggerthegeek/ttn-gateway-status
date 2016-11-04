/**
 * index
 */

"use strict";


/* Node modules */
var fs = require("fs");
var os = require("os");
var path = require("path");


/* Third-party modules */
var async = require("async");


/* Files */
var getGatewayStatus = require("./lib/getGatewayStatus");
var Notifications = require("./lib/notifications");
var SlackNotification = require("./notifications/slack");


var config = {
    gateway: process.env.TTN_GATEWAY,
    notifications: {
        slack: process.env.TTN_NOTIFICATION_SLACK
    },
    store: process.env.TTN_STORE || path.join(os.tmpDir(), "ttn-gateway-status.json"),
    timeout: Number(process.env.TTN_TIMEOUT_SECS || 60) * 1000,
    url: "https://staging.thethingsnetwork.org/gatewaystatus"
};


/* Ensure an array of gateway strings */
try {
    config.gateway = config.gateway.split(",");
} catch (err) {
    throw new Error("Gateways must be a comma-separated string");
}


/* Output the config for debugging */
console.log("--- CONFIG ---");
console.log(JSON.stringify(config, null, 2));
console.log("--------------");


/* Setup the notifications */
var notifications = new Notifications();

if (config.notifications.slack) {
    notifications.addSender(new SlackNotification(config.notifications.slack));
}


function trigger () {

    getGatewayStatus(config.url, config.gateway, function (err, status) {

        if (err) {
            /* Error getting the data - trigger a notification */
            throw err;
        }

        var tasks = [];

        /* Get the existing status */
        tasks.push(function (cb) {
            fs.readFile(config.store, "utf8", function (err, file) {

                /* We can assume a file error is file not found */
                try {
                    file = JSON.parse(file);
                } catch (err) {
                    file = {};
                }

                cb(null, file);

            });
        });

        /* Check the statuses */
        tasks.push(function (store, cb) {

            async.each(status, function (gateway, cb) {

                var gatewayId = gateway.eui;
                var storeGateway = store[gatewayId] || {};

                /* Treat as previously working if not in there */
                var storeUplink = storeGateway.uplinkActive;
                var storeDownlink = storeGateway.downlinkActive;
                if (storeUplink === void 0) { storeUplink = true; }
                if (storeDownlink === void 0) { storeDownlink = true; }

                var downlinkChange = gateway.downlinkActive !== storeDownlink;
                var uplinkChange = gateway.uplinkActive !== storeUplink;

                /* Trigger a notification if gone down or back up */
                if (downlinkChange || uplinkChange) {

                    /* Send a notification - it's changed since last time */
                    notifications.notify(gatewayId, {
                        downlinkPrevious: storeDownlink,
                        downlinkStatus: gateway.downlinkActive,
                        uplinkPrevious: storeUplink,
                        uplinkStatus: gateway.uplinkActive
                    }, gateway, cb);

                } else {
                    /* No notification to send */
                    cb(null);
                }


            }, cb);

        });

        /* Save the statuses */
        tasks.push(function (cb) {

            var data = status.reduce(function (result, gateway) {

                result[gateway.eui] = gateway;

                return result;

            }, {});

            fs.writeFile(config.store, JSON.stringify(data), "utf8", cb);

        });

        async.waterfall(tasks, function (err) {

            if (err) {
                console.log(err);
            }

            console.log("successfully checked gateways");

        });

    });

}


/* Activate */
trigger();
setInterval(trigger, config.timeout);