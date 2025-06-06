FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "src/app.js", "sh", "-c", "npx prisma migrate deploy && node index.js"]
RUN npx prisma generate