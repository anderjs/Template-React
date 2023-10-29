# build environment
FROM node:18.18.1

WORKDIR /client-dashboard

ENV PORT 80

COPY package.json /client-dashboard/package.json

RUN npm config set '@b1b2:registry' https://node-registry.bit.cloud

RUN npm install

COPY . /client-dashboard

CMD [ "cross-env NODE_ENV=development webpack serve --port 9004 --env development" ]