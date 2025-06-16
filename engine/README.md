# PythonEngine.md

# Tic Tac Toe AI Engine

A Flask-based REST API for playing Tic Tac Toe with an AI opponent. The AI uses pre-trained value functions to make optimal moves based on reinforcement learning.

## Features

- **REST API endpoints** for game operations
- **AI opponent** with pre-trained strategies for both X and O players
- **Complete game state management** including win/draw detection

## Requirements

- Python 3.6+
- Flask
- NumPy

## Installation

1. **Clone or download** the project files
2. **Install required dependencies:**

```bash
pip install flask numpy

```

1. **Ensure you have the pre-trained AI models** in the same directory as `engine.py`:
    - `vx.npy` - Value function for X player
    - `vo.npy` - Value function for O player

## File Structure

```
project/
├── engine.py          # Main Flask application
├── vx.npy            # Pre-trained values for X player
├── vo.npy            # Pre-trained values for O player
└── README.md

```

## Running the Server

Start the Flask development server:

```bash
python engine.py

```

The server will start on `http://localhost:5050` in debug mode.

## API Reference

### 1. Get Next Move

**Endpoint:** `POST /next_move`

Get the AI's optimal next move for the current game state.

**Request Body:**

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

**Response:**

```json
{
    "board": [
        [-1, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ],
    "move": [0, 0],
    "next_player": "o"
}

```

### 2. Check Game Status

**Endpoint:** `POST /game_status`

Determine if the game is over and identify the winner.

**Request Body:**

```json
{
    "board": [
        [-1, -1, -1],
        [1, 1, 0],
        [0, 0, 0]
    ]
}

```

**Response:**

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

### 3. Reset Game

**Endpoint:** `POST /reset_game`

Reset the game board to initial empty state.

**Request Body:** None required (empty POST)

**Response:**

```json
{
    "board": [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
}

```
