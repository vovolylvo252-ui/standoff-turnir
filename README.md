# TURNIR — Standoff 2 Competitive Platform

Платформа турниров по игре Standoff 2 в стиле FACEIT.

## Развертывание

### 1. Локальный запуск
```bash
# Установка зависимостей
npm install

# Настройка базы данных
npx prisma generate
npx prisma db push

# Запуск в режиме разработки
npm run dev