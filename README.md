# Voting App

A real-time voting application built with **Node.js**, **Express**, **Prisma (PostgreSQL)**, and **Socket.IO**.  
This app allows users to register, create polls, cast votes, and see live results.

---

## Features

- User registration with strong password validation
- Create and publish polls with multiple options
- Cast votes in real time
- Live updates of poll results via Socket.IO
- PostgreSQL database with Prisma ORM

---

## Setup Instructions

1. **Clone the repository**
   git clone [https://github.com/your-username/voting-app.git](https://github.com/Sau0908/Voting-App.git)
   cd voting-app

2. **Install dependencies**
   npm install

3. **Configure environment variables**
   Create a .env file in the root directory:

    DATABASE_URL="postgresql://<user>:<password>@localhost:5432/voting_db?schema=public"
    PORT=8080
    JWT_SECRET="test"

4. **Run database migrations**
   npm run db:migrate

5. **Start the server**
   npm run start

### If you have the Live Server extension for VS Code:

### Right-click on test.websocket.html and select "Open with Live Server"

### use tableplus for the db view (optional)
