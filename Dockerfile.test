FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 3001

COPY . .

CMD [ "npm", "run", "test:e2e" ]
