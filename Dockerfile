########################################
# Docker                               #
#                                      #
# A NodeJS container that enables the  #
# application to run                   #
########################################

FROM node:6

MAINTAINER Simon Emms, simon@simonemms.com

# Set the work directory and add the project files to it
WORKDIR /opt/ttn
ADD . /opt/ttn

# Install the dependencies
RUN npm install --production

# Run run run
CMD /opt/ttn/bin/ttngs.js
