# ttn-gateway-status

A monitor for The Things Network gateways

# Rationale

This is a very simple monitoring application to check the status of The Things Network gateways. It fetches
data from the [gateway status](https://staging.thethingsnetwork.org/gatewaystatus) page.

The data is expected in space-delimited lines in the format EUI, UPLINK, DOWNLINK, LAST_SEEN.

# Installation and Usage

Ensure that you have NodeJS setup on your machine. The application is written in ES5 so should work with >= 0.10,
however >= 4.0 is recommended.

    [sudo] npm install -g ttn-gateway-status
    
This will give you access to the `ttngs` executable

# Notifications

You will only be notified of a change in the uplink or downlink status.

Currently, [Slack](https://slack.com) is the only supported recipient.