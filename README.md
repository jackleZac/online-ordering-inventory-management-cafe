# Café Ordering System

A full-stack web application for managing café orders, built with React (Vite) on the frontend and Node.js (Express) on the backend.

## Project Structure

```
project-root/
├── client/       # React + Vite frontend
├── server/       # Node.js backend
```

---

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm
- Express
- MongoDB
- Mongoose
- Tailwind CSS
- Stripe
---

## Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd client
   ```

2. Create a .env file with the following:
   ```
   REACT_APP_API_URL=http://localhost:3000
   CHOKIDAR_USEPOLLING=true
   SERVER_URL=http://localhost:8080
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Visit the app at:
   ```
   http://localhost:3000
   ```

---

## Backend Setup (Node.js)

1. Navigate to the backend directory:
   ```bash
   cd server
   ```

   ⚠️ **MongoDB Setup Required**
   
   Before running the backend, make sure you have a MongoDB database ready:
   - You can create a free MongoDB Atlas cluster or use a local MongoDB instance.
   - Once created, copy your connection string and update the .env file in the server/ directory:

   ```
   DB=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```

   Make sure the database name is cafe or adjust the mongoose.connect() call in index.js accordingly.

2. Create a .env file with following:
   ```
   PORT=3000
   DB=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   DB_PASS={enter-your-DB-password}
   ACCESS_TOKEN_SECRET={enter-your-token-secret}
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   node index.js
   ```
   Or
   ```bash
   npm run start
   ```

5. Backend will run at:
   ```
   http://localhost:3000
   ```

---

## 🔗 Connecting Frontend to Backend

Ensure your frontend API calls point to the backend URL (e.g. `http://localhost:3000`). 

```env
VITE_API_URL=http://localhost:3000
```

And in your frontend code:
```js
fetch(`${import.meta.env.VITE_API_URL}/orders`)
```

---

## 🧩 Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Other**: Axios, CORS, dotenv, Stripe

---

## 📁 Folder Highlights

- `client/src/` — React components, pages, and assets
- `server/` — API routes, business logic, and server config

---
# User Interfaces
## Home
<img width="1894" height="921" alt="image" src="https://github.com/user-attachments/assets/19a2a91b-324a-4e20-b582-3ddf54e51537" />
<img width="1261" height="757" alt="image" src="https://github.com/user-attachments/assets/5a143c72-2076-4ead-917e-2f4306c46e26" />
<img width="1266" height="757" alt="image" src="https://github.com/user-attachments/assets/59256296-8c4e-42c4-a22c-75330037fb46" />

## Login
<img width="1153" height="757" alt="image" src="https://github.com/user-attachments/assets/a825cb4c-ae87-4e95-b435-d90e1aad05a7" />

## Register
<img width="1261" height="756" alt="image" src="https://github.com/user-attachments/assets/1134b339-e466-47de-a824-6a06db5d7735" />

## Menu
<img width="1888" height="919" alt="image" src="https://github.com/user-attachments/assets/5e28c9e7-944c-4606-ae3c-a18c421c48ef" />
<img width="1261" height="764" alt="image" src="https://github.com/user-attachments/assets/cb8fc4bc-a092-4571-a121-c6af1f66f4a7" />

## Contact Us
<img width="1889" height="919" alt="image" src="https://github.com/user-attachments/assets/8f391428-9bfb-4aaf-920d-74efc2d940c4" />
