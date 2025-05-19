# Weather API

A backend service that allows users to subscribe to regular weather updates for a selected city via email. Built with Node.js, TypeScript, Express, Prisma, and PostgreSQL, containerized using Docker, and deployed on Render.

## Table of Contents
- [Getting Started](#getting-started)
  - [Deployment URL (Render)](#deployment-url-render)
  - [Running the Project Locally](#running-the-project-locally)
    - [Option 1: Docker (Recommended)](#option-1-docker-recommended)
    - [Option 2: Manual (Nodejs)](#option-2-manual-nodejs)
  - [Environment Variables](#environment-variables)
  - [Example](#example)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

## Getting Started

This project provides a weather subscription API that supports confirmation emails and regular weather updates via email. You can run it locally with Docker or manually with Node.js.

### Deployment URL (Render)
The API is hosted here:
```
https://weather-api-boxh.onrender.com
```
You can use the "Try it out" buttons to call live endpoints. Email delivery works with Gmail when running on Render.

>[!NOTE]
>Swagger's "Try it out" works best over HTTPS. Make sure to select the `https` schema in the Swagger UI. Rate limiting is enabled in production, restricting requests to **5 per minute per IP address** to prevent abuse.

>[!WARNING]
>Due to the restrictions of Render's free plan, the app will regularly spin down with inactivity. Therefore, automatic emails may not be delivered at all times.

## Running the Project Locally
You can run the app in two ways:

### Option 1: Docker (Recommended)

```
docker-compose up --build
```

This will:
- Spin up a PostgreSQL database
- Start the weather API container
- Automatically apply database migrations
- Expose the API at `http://localhost:3000`
No manual setup is needed, except for a `.env` file (see below)

### Option 2: Manual (Node.js)

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

You will also need to:
- Provide a **PostgreSQL** instance yourself
- Set the `DATABASE_URL` in `.env`

## Environment Variables

To run the app correctly, you must create a `.env` file in the project root. Below are the variables you need:

### Weather API (required)

```env
WEATHER_API_URL=https://api.weatherapi.com/v1/current.json
WEATHER_API_KEY=your_weather_api_key_here
```

### Email Configuration

These are required for both Ethereal (testing) and Gmail (production):

```env
EMAIL_FROM="Weather API <no-reply@weatherapi.test>"
EMAIL_USER=your_email_user
BASE_URL=http://localhost:3000
```

`BASE_URL` is used to generate links in confirmation and unsubscribe emails.

### Gmail SMTP (used automatically in production)

If `NODE_ENV=production` is set, the API will use Gmail to send emails via OAuth2. Set these additional variables:

```env
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
```

To obtain a refresh token, you must register your app in the Google Cloud Console and authorize it once.

>[!NOTE]
>**In development**, the API uses [Ethereal](https://ethereal.email/) to simulate email delivery. Log output includes preview URLs.
>**In production (e.g., Render)**, the API uses **Gmail SMTP** by default if the Gmail credentials are present.

## Example

```bash
# Run locally with Docker and simulate emails
cp .env.example .env
docker-compose up --build
```

Or:

```bash
# Run with local Node.js and custom database
export DATABASE_URL=postgresql://...
npm install
npx prisma migrate dev
npm run dev
```

## Features
- Subscribe to weather updates for a specific city and frequency (daily or hourly)
- Confirm subscriptions via email
- Unsubscribe anytime using a unique link
- Fetch current weather for a city using external WeatherAPI
- Automated scheduled email delivery with weather data
- API documentation via Swagger UI
- Centralized error handling and rate limiting

## Tech Stack
- Node.js with Express
- TypeScript for type safety
- Prisma ORM for database access
- PostgreSQL as the database
- Nodemailer for email delivery
- Docker and docker-compose for containerization
- Jest for unit testing
- Swagger for API docs
- Node-cron for scheduled tasks
- GitHub Actions for automated unit testing
- Postman Collections for quick manual API testing

## Project Structure
```
src/
├── controllers/         // Route handlers
├── services/            // Business logic (e.g., email, weather, DB)
├── lib/                 // Prisma client, utilities, error classes
├── middlewares/         // Error handler, rate limiter, etc.
├── jobs/                // Cron job for email delivery
├── routes/              // Express route definitions
├── models/              // TypeScript interfaces
├── docs/                // Swagger YAML file

```
