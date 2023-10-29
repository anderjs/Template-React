# build environment
FROM node:18.18.1 AS build
WORKDIR /@client-dashboard
ENV PATH /@client-dashboard/node_modules/.bin:$PATH
COPY package.json /@client-dashboard/package.json
RUN npm config set '@b1b2:registry' https://node-registry.bit.cloud
RUN npm install --silent
COPY . /@client-dashboard/

RUN rm -v /@client-dashboard/.env.development
COPY .env.docker /@client-dashboard/.env.development
ENV API http://localhost:3000

RUN npm start