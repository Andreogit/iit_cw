FROM node:18

WORKDIR /app

# Декларуємо аргумент для build-time
ARG BASE_URL

# Якщо потрібно, робимо цю змінну доступною у рантаймі
ENV BASE_URL=${BASE_URL}

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь проєкт
COPY . .

# Копіюємо сертифікат
COPY certs/global-bundle.pem ./certs/global-bundle.pem

EXPOSE 5000

# Стартуємо сервер
CMD ["node", "index.js"]
