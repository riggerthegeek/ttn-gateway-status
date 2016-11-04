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

This will give you access to the `ttngs` executable with the following options:

  - **g/gateways**: A comma-separated list of gateway IDs to check [required]
  - **slack**: POST webhook URL for your Slack channel [required]
  - **file**: JSON file that stores changes to the gateway status (defaults to a file in your tmp directory)
  - **t/timeout**: The time (in seconds) before the gateways are checked again (defaults to 60)

You can also use environment variables if you prefer, prefixed with "TTN_" (`--gateways` would become `TTN_GATEWAYS`
for example).

An example run command would be:

    ttngs --gateways=MY_GATEWAY_EUI --slack=MY_SLACK_URL

> You can check this by typing `ttngs --help`.

# Notifications

You will only be notified of a change in the uplink or downlink status.

Currently, [Slack](https://slack.com) is the only supported recipient. To set up your channel, please visit the
[Incoming WebHooks](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks) help page.

# Docker

You can always run this using the Docker implementation. The Docker version is the same as the npm version. The
setup is identical to above, except that you must set your environment variables in your docker run.

    docker run --rm -it -e TTN_GATEWAYS=MY_GATEWAY_EUI -e TTN_SLACK=MY_SLACK_URL riggerthegeek/ttn-gateway-status

This Docker image is also in the hub at [riggerthegeek/ttn-gateway-status](https://hub.docker.com/r/riggerthegeek/ttn-gateway-status).

# ToDo

 - Add email support
 - Increase unit tests
 - Automate Docker deployment
