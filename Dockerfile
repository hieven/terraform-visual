# Base image
FROM node:14.1.0-alpine as base

RUN apk update && apk upgrade
RUN apk add --no-cache bash

RUN mkdir /opt/app
WORKDIR /opt/app

# Build image
FROM base as build

RUN apk update && apk upgrade
RUN apk add --no-cache make gcc g++ python yarn

COPY package.json yarn.lock ./

RUN yarn install

COPY . .
RUN npm run build

RUN rm -rf node_modules
RUN yarn install --production

# Runtime image
FROM base

USER node

COPY --from=build --chown=node:node /opt/app .

CMD ["npm", "start"]
