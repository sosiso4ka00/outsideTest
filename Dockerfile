
FROM node:alpine

WORKDIR /node/src
COPY . .
RUN npm install 

