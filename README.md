# Nest Justify Text API

This is a RESTful API built with **NestJS** that justifies text to a specific line length (80 characters) and provides a token-based authentication mechanism for users. The API limits usage by words per day and implements a cron job to reset users' daily word count.

## Features

- **Text Justification**: The `/api/justify` endpoint justifies the input text to 80 characters per line.
- **User Registration**: Users can register using an email at `/api/token` and receive a unique token for authentication.
- **Rate Limiting**: Each registered user is limited to 80,000 words per day. If the limit is exceeded, the API returns a `402 Payment Required` error.
- **Scheduled Job**: A cron job resets the daily word limit for all users at midnight every day.

## Requirements

- **Node.js** >= 18.x
- **NestJS** >= 9.x
- **Prisma** ORM for database management
- **PostgreSQL** or any other database supported by Prisma
- **JWT (JSON Web Tokens)** for authentication

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nest-justify-text-api.git
cd nest-justify-text-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a .env file in the root directory and configure the following variables:

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/yourdb
SECRET=your_jwt_secret_key
MAX_DAILY_WORDS=80000
TEXT_LINE_LENGTH=80
```

### 4. Set up the database

Run the following command to set up your Prisma database:

```BASH
npx prisma migrate dev
```

### 5. Start the application

Run the following command to set up your Prisma database:

```BASH
npm run start
```

The application will start on http://localhost:3000.

## API Endpoints

### /api/token - User Registration

#### Method: POST

- Request body:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- Response:
  - Returns a unique JWT token on success.
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

### /api/justify - Justify Text

#### Method: POST

- Headers:
  - Authorization: token (JWT token received from /api/token).
- Request body: text/plain (raw text to be justified).
- Response: Justified text with 80 characters per line.

### Error Responses

- Unauthorized (401): If the Authorization token is missing or invalid.
- Payment Required (402): If the user has surpassed the daily word limit of 80,000 words.
- Bad Request (400): If the request body is missing, malformed, or of an incorrect type.

## Rate Limiting

- Each registered user has a limit of 80,000 words per day.
- If the limit is exceeded, the API returns a 402 Payment Required error
- The daily word count is reset every day at midnight (CET) by a cron job.

## Scheduled Job

The job to reset the daily word limit for all users is scheduled to run at midnight every day using the cron expression 0 0 \* \* \*.

## Running Tests
To run the tests, use the following command:
```bash
  npm run test
```
This will run all the unit tests for the API.
