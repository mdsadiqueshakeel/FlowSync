FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm", "run", "dev", "--", "--host", "--port", "5001"]
