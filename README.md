# Weather Forecast API

Weather API application

A small Node.js + PostgreSQL service that lets users look up the current weather for a city and subscribe to automated e‑mail updates (hourly or daily).The whole stack runs with a single command:

```
# clone & enter repo
cp .env.example .env   # fill in WEATHER_API_KEY & SMTP_URL

# start everything (API + PostgreSQL)
docker compose up --build
```

### Features

- Current Weather – Proxy to WeatherAPI.com and return temperature, humidity, description

- E-mail subscriptions

- Hourly / Daily cron jobs send updates via SMTP (using nodemailer)

- PostgreSQL migrations via Knex auto-run on startup

- Winston logging (console & logs/app.log)

### Environment Variables

Copy the example file and configure values:

```
WEATHER_API_KEY - Free key from WeatherAPI.com
```

```
DATABASE_URL - Postgres connection string
```

```
BASE_URL - Public base URL used inside emails
```

```
JWT_SECRET - Token signing secret
```

### Endpoints

Current weather for a city:

```
GET /api/weather?city=Oslo
```

Subscribe via form fields email, city, frequency (hourly|daily):

```
POST /api/subscribe
```

Confirm subscription:

```
GET /api/confirm/{token}
```

Cancel subscription:

```
GET /api/unsubscribe/{token}
```
