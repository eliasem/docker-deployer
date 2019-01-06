FROM mhart/alpine-node:8
COPY docker/deploy.js /opt/deploy.js
COPY package.json /opt/package.json
WORKDIR /opt
RUN npm i
ENTRYPOINT node /opt/deploy.js