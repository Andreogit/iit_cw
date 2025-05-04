FROM node:18

WORKDIR /app

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо залежності, у тому числі для sqlite3
RUN npm install

# Копіюємо весь проєкт
COPY . .

# Перезбираємо sqlite3 для правильної архітектури
RUN npm rebuild sqlite3

EXPOSE 5000
CMD ["node", "index.js"]
