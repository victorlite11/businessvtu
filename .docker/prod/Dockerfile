FROM node:14.21.1-alpine

WORKDIR /app

COPY package.json package.json

RUN yarn

COPY . .

EXPOSE 4200

RUN yarn build

CMD ["yarn", "start", "--host", "0.0.0.0", "--port", "4200", "--disableHostCheck", "true"]
