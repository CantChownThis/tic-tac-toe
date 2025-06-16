# BackendServer.md

# Tic Tac Toe Express Server

A Node.js Express backend server that provides user authentication, game session management, and statistics tracking for the Tic Tac Toe AI engine. This server acts as a middleware layer between frontend clients and the Python AI engine.

## Features

- **User Authentication** with JWT tokens
- **Password validation** with security requirements
- **Game session management** with MongoDB persistence
- **Player statistics tracking** (wins, losses, draws)
- **Engine integration** with the Python engine
- **CORS enabled** for frontend integration
- **Automatic game state management** and cleanup

## Libraries

- **Express.js**
- **Mongoose** for database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Axios** for requests to AI engine

## Requirements

- Node.js v22.15.0
- MongoDB instance (local or cloud)
- Python Tic Tac Toe Engine running on specified port
- npm package manager

## Installation

1. **Clone or download** the project files
2. **Install dependencies:**
    
    ```bash
    npm install express mongoose bcrypt jsonwebtoken cors axios dotenv
    
    ```
    
3. **Create environment file** `.env` in the root directory:
    
    ```
    SECRET=your_jwt_secret_key_here
    DB_URI=mongodb://localhost:27017/tictactoe or MongoDB Atlas
    ENGINE_URI=http://localhost:5050
    
    ```
    
4. **Start your MongoDB server** (if running locally)
5. **Ensure the Python AI engine is running** on the specified ENGINE_URI

## Environment Variables

Create a `.env` file with the following variables:

```
# JWT Secret for token signing (use a strong, random string)
SECRET=your_super_secret_jwt_key_change_this_in_production

# MongoDB connection string
DB_URI=mongodb://localhost:27017/tictactoe
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/tictactoe

# Python AI Engine URL
ENGINE_URI=http://localhost:5050

```

## Database Schema

### User Collection

```jsx
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  stats: {
    wins: Number (default: 0),
    losses: Number (default: 0),
    draws: Number (default: 0)
  },
  createdAt: Date,
  updatedAt: Date
}

```

### Game Sessions Collection

```jsx
{
  _id: ObjectId,
  user: ObjectId (reference to User),
  board: [[Number]], // 3x3 array
  current_player: String, // "x" or "o"
  createdAt: Date,
  updatedAt: Date
}

```

## Running the Server

Start the Express server:

```bash
node server.js

```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /register`

Create a new user account with password validation.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

```

**Response (Success):**

```json
{
  "message": "User registered successfully"
}

```

**Response (Error):**

```json
{
  "error": "Password should be at least 8 chars"
}

```

### 2. Login User

**Endpoint:** `POST /login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

```

**Response (Success):**

```json
{
  "myToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

```

**Response (Error):**

```json
{
  "error": "Invalid"
}

```

### Game Endpoints (Require Authentication)

All game endpoints require the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>

```

### 3. Start New Game

**Endpoint:** `POST /game/start`

Start a new game session. Previous sessions are automatically deleted.

**Request Body:**

```json
{
  "userStarts": true
}

```

**Response:**

```json
{
  "board": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ],
  "current_player": "x"
}

```

### 4. Make Move

**Endpoint:** `POST /game/move`

Make a move in the current game session. AI automatically responds.

**Request Body:**

```json
{
  "row": 0,
  "col": 1
}

```

**Response (Game Ongoing):**

```json
{
  "board": [
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, 0]
  ],
  "game_status": "ongoing",
  "current_player": "x"
}

```

**Response (Game Ended):**

```json
{
  "board": [
    [-1, -1, -1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  "game_status": "winner - X"
}

```

### 5. Get Game Status

**Endpoint:** `GET /game/status`

Get current game state.

**Response:**

```json
{
  "board": [
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, 0]
  ],
  "game_status": "ongoing",
  "current_player": "x"
}

```

### 6. Get User Statistics

**Endpoint:** `GET /user/stats`

Get current user's game statistics.

**Response:**

```json
{
  "user": "user@example.com",
  "stats": {
    "wins": 5,
    "losses": 3,
    "draws": 2
  }
}

```

## Functions

1. **User registers/logs in** to get JWT token
2. **Start game** with choice of who goes first
3. **Make moves** by sending row/col coordinates
4. **AI automatically responds** after each user move
5. **Game ends** when there's a winner or draw
6. **Statistics are updated** automatically
7. **Session is cleaned up** when game ends
