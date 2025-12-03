# Исправление ошибок деплоя на Vercel

## ✅ Исправлено в vercel.json

### Проблема 1: Invalid route source pattern
**Исправлено:** Упрощен паттерн rewrite до `/(.*)` - Vercel автоматически отдает статические файлы, если они существуют.

### Проблема 2: Unused Vercel Function region setting
**Решение:** Это предупреждение, не ошибка. Если не используете Serverless Functions, можно игнорировать.

## Текущая конфигурация

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Как задеплоить

### Вариант 1: Через Vercel Dashboard

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Подключите Git репозиторий (GitHub/GitLab/Bitbucket)
4. Vercel автоматически определит:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Нажмите "Deploy"

### Вариант 2: Через Vercel CLI

```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите
vercel login

# Деплой (первый раз - выберите настройки)
vercel

# Production деплой
vercel --prod
```

## Если все еще не работает

1. **Проверьте, что файлы в репозитории:**
   - `vercel.json` должен быть в корне
   - `package.json` должен содержать `build` скрипт
   - `vite.config.js` должен быть настроен

2. **Проверьте логи сборки:**
   - В Vercel Dashboard → Deployments → выберите деплой → Build Logs
   - Убедитесь, что сборка прошла успешно

3. **Проверьте структуру dist:**
   - После сборки должна быть папка `dist/`
   - В ней должны быть `index.html` и папка `assets/`

4. **Очистите кеш:**
   - В Vercel Dashboard → Settings → General → Clear Build Cache
   - Или передеплойте с флагом `--force`

## Проверка после деплоя

1. Откройте ваш домен (например, `https://your-project.vercel.app`)
2. Откройте DevTools → Network
3. Проверьте загрузку:
   - `index.html` → 200
   - `/assets/index-xxx.js` → 200
   - `/assets/index-xxx.css` → 200

Если все файлы загружаются с кодом 200 - всё работает! ✅

