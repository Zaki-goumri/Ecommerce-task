ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

USER node

COPY . .

EXPOSE 5000

ENV MONGODB_URI=${MONGODB_URI}
ENV REDIS_URL=${REDIS_URL}

CMD ["npm", "start"]
