# Tic-Tac-Toe Web App

A full-stack Tic-Tac-Toe game built with React (frontend) and Node.js + MongoDB (backend). Users can register, log in, logout, choose who starts the game, play against a computer AI, and view their win/loss/draw statistics.

---

## 🌐 Frontend Features

- Built with **React + Redux** using `@reduxjs/toolkit`
- JWT-based **authentication (login, register, logout)**
- Option to choose who starts: **User or Computer**
- Responsive **Tic-Tac-Toe board**
- TailwindCSS **UI Styling**
- Real-time game state updates
- User **statistics screen**
- Persistent login with `localStorage`
- Clean, modular component architecture
- Protected Routes

---

## Folder Structure

src/
├── api/            # Axios API logic
├── assets/         # images and misc
├── components/     # Reusable UI components
├── redux/          # Redux slices + store
├── App.jsx         # Root component
├── index.js        # App entry
└── index.css       # Global styles
.env

## 🚀 Getting Started

### Prerequisites

- Node.js (v22.15.0)
- Backend server running at `http://localhost:3000`
- `.env` file with:

```env
PORT=3003
REACT_APP_API_URL=http://localhost:3000
```

## Installation

1. **Clone or download** the project files
2. **Install dependencies:**

    ```bash
    npm install
    
    ```

## Running the Server

Start the app:

```bash
npm start

```