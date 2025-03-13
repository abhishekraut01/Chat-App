# ChatApp

A real-time chat application built with React (frontend) and Node.js (backend) using WebSockets.

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Zustand, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, TypeScript, MongoDB, Socket.io
- **Database:** MongoDB
- **Cloud Storage:** Cloudinary

## 🚀 Features

- Real-time messaging with WebSockets
- User authentication (JWT-based)
- Image uploads via Cloudinary
- Responsive UI with Tailwind CSS

## 📦 Local Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/abhishekraut01/Chat-App
cd ChatApp
```

### 2️⃣ Set Up the Backend

1. Navigate to the `server` directory:

    ```sh
    cd server
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the `server` directory and add the following variables:

    ```ini
    ALLOW_ORIGIN=http://localhost:5173
    MONGODB_URI=your_mongodb_connection_string
    ACCESS_TOKEN_SECRET=your_secret_key

    CLOUDINARY_CLOUD_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. Start the backend server:

    ```sh
    npm run dev
    ```

### 3️⃣ Set Up the Frontend

1. Navigate to the `client` directory:

    ```sh
    cd ../client
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the frontend:

    ```sh
    npm run dev
    ```

### 4️⃣ Run the Application

- The backend will run on `http://localhost:5000`
- The frontend will be available at `http://localhost:5173`

## 🛠 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login a user |
| GET | `/api/v1/message` | Get chat messages |
| POST | `/api/v1/message/send` | Send a message |

## 📌 Notes

- Make sure MongoDB is running before starting the backend.
- WebSocket events are handled in `Socket.ts`.

## 📜 License

This project is licensed under the MIT License.