# Встановлюємо офіційний Node.js образ
FROM node:18

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо package файли та встановлюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо весь проєкт
COPY . .

# Білд Nuxt (для SSR або статичного сайту)
RUN npm run build

# Запускаємо Nuxt у production режимі
EXPOSE 3000
CMD ["npm", "run", "preview"]