FROM node:carbon
WORKDIR /usr/src/app/
COPY . .
RUN npm install
EXPOSE 8854
CMD ["node","index.js"]
