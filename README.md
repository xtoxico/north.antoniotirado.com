# North

> **Status**: MVP Completed 🚀

North is a goal tracking and habit building application aimed at helping users achieve their personal "North Star".

## Features

- **Goal Management**: Create and track Eliminate, Build, and Achievement goals.
- **Habit Tracking**: Streak calculations, daily logging, and visual progress.
- **Authentication**: Secure login with Google OAuth 2.0.
- **PWA**: Installable on mobile devices.
- **Notifications**: Automated daily reminders and streak protection logic.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a deep dive into the system design.

## Quick Start

### Prerequisites

- Node.js 18+ (Verified with v22)
- Docker & Docker Compose
- Google Cloud Console Credentials (for Auth)
- Firebase Project (for Notifications)

### Setup

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Infrastructure**
    Start the database:

    ```bash
    docker-compose up -d
    ```

3.  **Environment**
    Copy the example and fill in your credentials:

    ```bash
    cp .env.example .env
    ```

4.  **Database**
    Initialize the schema and seed data:

    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

5.  **Run**
    Start both the API and Web Client:

    ```bash
    npx nx serve api
    npx nx serve web-client
    ```

6.  **Verify**
    - Web: http://localhost:4201
    - API: http://localhost:3333
    - Docs: http://localhost:3333/api/docs

## Development

- **Build**: `npx nx build api && npx nx build web-client`
- **Lint**: `npx nx lint`
