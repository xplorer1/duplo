# Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install --production

COPY . .

CMD [ "node", "index.js" ]
EXPOSE 9000