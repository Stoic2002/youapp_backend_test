# your node version
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#your nest port
EXPOSE 8000

CMD ["npm", "run", "start:prod"]