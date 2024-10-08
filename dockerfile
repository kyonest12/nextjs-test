FROM node:latest

WORKDIR /app

COPY . .

RUN npm run build
ENV PATH /app/node_modules/.bin:$PATH
RUN ["pm2", "link", "08lgnfh51do7c22", "qu1c16a8uqbzei3"]
#CMD ["node", "next.js"]
CMD ["pm2-runtime", "start", "npm", "--name", "feNext", "--", "run", "start"]


