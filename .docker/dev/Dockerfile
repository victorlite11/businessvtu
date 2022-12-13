FROM node:14.21.1-alpine as base

WORKDIR /app

COPY package.json package.json

RUN yarn

COPY . .

EXPOSE 4200

