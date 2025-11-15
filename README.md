# Wildberries Ads Analytics Dashboard

Минимальный аналитический дашборд для Wildberries Ads с бэкендом на Node.js/Express и фронтендом на Next.js/React.

## 🚀 Возможности

- **API-прокси для Wildberries API**: Безопасное проксирование запросов к Wildberries Ads API
- **Проверка API-ключа**: Валидация ключей перед отправкой запросов
- **Список кампаний**: Получение и отображение всех рекламных кампаний
- **Статистика кампаний**: Детальная статистика по кликам, показам, CTR
- **Визуализация данных**: Интерактивные графики и таблицы
- **Живые запросы**: Без базы данных, только real-time запросы к API

## 📋 Требования

- Node.js 18+ 
- npm 9+
- Валидный API-ключ Wildberries Ads

## 🛠️ Установка

### Backend

```bash
cd backend
npm install
```

Создайте файл `.env` (опционально):
```bash
PORT=3001
```

Запустите сервер:
```bash
npm start
```

Backend будет доступен на `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
```

Создайте файл `.env.local` (опционально):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Запустите приложение:
```bash
npm run dev
```

Frontend будет доступен на `http://localhost:3000`

## 📡 API Endpoints

### Backend API

- `GET /api/health` - Проверка состояния API
- `GET /api/campaigns` - Получение количества кампаний
- `GET /api/campaigns/list` - Получение списка всех кампаний
- `POST /api/campaigns/fullstats` - Получение полной статистики кампании
- `POST /api/clusters/stats` - Получение статистики поисковых кластеров

Все эндпоинты (кроме `/api/health`) требуют заголовок `X-API-Key` с валидным ключом Wildberries.

### Примеры запросов

#### Получение списка кампаний
```bash
curl -H "X-API-Key: YOUR_API_KEY" http://localhost:3001/api/campaigns/list
```

#### Получение статистики кампании
```bash
curl -X POST http://localhost:3001/api/campaigns/fullstats \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": [12345],
    "dates": {
      "from": "2024-01-01",
      "to": "2024-01-31"
    }
  }'
```

## 💡 Использование

1. Откройте дашборд в браузере
2. Введите ваш API-ключ Wildberries
3. Нажмите "Connect" для загрузки списка кампаний
4. Выберите кампанию из выпадающего списка
5. Настройте диапазон дат (по умолчанию - последние 30 дней)
6. Просматривайте статистику в виде:
   - Сводных карточек (показы, клики, CTR, расходы)
   - Графиков (показы и клики во времени, CTR)
   - Детальной таблицы со всеми метриками

## 🏗️ Структура проекта

```
web3ADV/
├── backend/              # Node.js/Express API сервер
│   ├── server.js        # Основной файл сервера
│   ├── package.json     # Зависимости backend
│   └── .env.example     # Пример конфигурации
├── frontend/            # Next.js/React приложение
│   ├── app/            # App Router страницы
│   │   ├── page.tsx   # Главная страница дашборда
│   │   └── layout.tsx # Layout приложения
│   ├── package.json   # Зависимости frontend
│   └── .env.local.example
└── README.md
```

## 🔧 Технологический стек

### Backend
- Node.js
- Express.js
- Axios (для HTTP запросов)
- CORS
- dotenv

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Recharts (графики)
- Axios

## 🔒 Безопасность

- API-ключи передаются через заголовки (не в URL)
- Backend валидирует наличие API-ключа перед каждым запросом
- CORS настроен для безопасной работы
- API-ключи хранятся только в состоянии браузера (не в localStorage)

## 📝 Лицензия

ISC

## 👨‍💻 Разработка

Для разработки запустите оба сервера одновременно:

Terminal 1 (Backend):
```bash
cd backend && npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend && npm run dev
```
