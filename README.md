# Экзамен-тренажёр

React + Vite приложение для проведения экзаменов-тренажёров.

## Возможности

- 2 дисциплины, по 300 вопросов каждая
- Случайная выборка 60 вопросов из 300 при начале теста
- Таймер на 60 секунд для каждого вопроса
- Блокировка вопросов после истечения времени (невозможность вернуться)
- Рандомизация порядка вопросов и вариантов ответов
- Система оценивания: 42-48 = 3, 49-54 = 4, 55-60 = 5
- Адаптивный дизайн

## Установка и запуск

### Разработка

```bash
npm install
npm run dev
```

### Сборка для production

```bash
npm run build
```

Собранные файлы будут в папке `dist/`, готовые для развертывания на nginx или другом веб-сервере.

## Развертывание на nginx

1. Соберите проект: `npm run build`
2. Скопируйте содержимое папки `dist/` в директорию nginx (например, `/usr/share/nginx/html/`)
3. Настройте nginx для поддержки React Router:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Структура проекта

- `src/pages/` - страницы приложения (HomePage, TestPage, ResultsPage)
- `src/components/` - переиспользуемые компоненты (Timer, QuestionCard)
- `src/data/` - JSON файлы с вопросами (discipline1.json, discipline2.json)

## Редактирование вопросов

Вопросы хранятся в JSON файлах в папке `src/data/`. Формат:

```json
{
  "id": 1,
  "question": "Текст вопроса",
  "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
  "correctAnswer": 0
}
```

`correctAnswer` - индекс правильного ответа (0-3).
