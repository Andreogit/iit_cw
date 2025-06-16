FROM node:18

WORKDIR /app

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо залежності, у тому числі для sqlite3
RUN npm install

# Копіюємо весь проєкт
COPY . .

# Копіюємо сертифікат у контейнер
COPY certs/global-bundle.pem ./certs/global-bundle.pem

EXPOSE 5000
CMD ["node", "index.js"]
