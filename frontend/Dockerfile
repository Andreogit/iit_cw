FROM node:18

# Робоча директорія
WORKDIR /app

# Копіюємо файли
COPY . .

# Встановлюємо залежності
RUN npm install

# Білд
RUN npm run build

# Відкриваємо порт
EXPOSE 3000

# Запуск Nuxt сервера
CMD ["npm", "run", "start"]
