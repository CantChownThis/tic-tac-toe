const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();

const SECRET = process.env.SECRET;
const ENGINE_URI = process.env.ENGINE_URI;

async function connectDB() {
	try {
		await mongoose.connect(process.env.DB_URI);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
	}
}

const userSchema = new mongoose.Schema(
	{
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		stats: {
			wins: { type: Number, default: 0 },
			losses: { type: Number, default: 0 },
			draws: { type: Number, default: 0 },
		},
	},
	{ timestamps: true }
);

const gamesSchema = new mongoose.Schema(
	{
		user: mongoose.Schema.Types.ObjectId,
		board: [[Number]],
		current_player: String,
	},
	{ timestamps: true }
);

function auth(req, res, next) {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ error: "No token provided" });

	try {
		const mySecret = jwt.verify(token, SECRET);
		req.user = mySecret;
		next();
	} catch (e) {
		res.status(401).json({ error: "Invalid token provided" });
	}
}

app.post("/register", async (req, res) => {
	try {
		await connectDB();
	} catch (error) {
		console.error("Database connection error:", error);
		return res.status(500).json({ message: "Database connection error" });
	}
	const { email, password } = req.body;

	const hasLetter = /[A-Za-z]/.test(password);
	const hasDigit = /\d/.test(password);
	const hasSpecial = /[!@#$%^&*()_\-+=\[\]{}|;:'",.<>/?`~\\]/.test(password);

	if (password.length < 8) {
		res.status(400).json({ error: "Password should be at least 8 chars" });
	}
	if (!hasLetter || !hasDigit || !hasSpecial) {
		res.status(400).json({
			error:
				"Password must include at least a letter, a number, and a special character",
		});
	} else {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);
		const User = mongoose.model("User", userSchema);
		try {
			await User.create({ email, password: hash });
			res.json({ message: "User registered successfully" });
			// console.log("Successful register");
		} catch (e) {
			res.status(400).json({ error: "Register failed" });
		}
	}
});

app.post("/login", async (req, res) => {
	try {
		await connectDB();
	} catch (error) {
		console.error("Database connection error:", error);
		return res.status(500).json({ message: "Database connection error" });
	}

	const { email, password } = req.body;
	const User = mongoose.model("User", userSchema);

	const my_user = await User.findOne({ email });
	const hash = bcrypt.compareSync(password, my_user.password);
	if (!my_user || !hash) {
		return res.status(401).json({ error: "Invalid" });
	}

	const myToken = jwt.sign(
		{
			id: my_user._id,
			email,
			expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
		},
		SECRET
	);
	res.json({ myToken });
	// console.log("Successful login");
});

app.post("/game/start", auth, async (req, res) => {
	try {
		await connectDB();
	} catch (error) {
		console.error("Database connection error:", error);
		return res.status(500).json({ message: "Database connection error" });
	}
	const GameSession = mongoose.model("GameSession", gamesSchema);
	const user = req.user.id;
	const { userStarts } = req.body;

	let board = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
	];

	let current_player = userStarts ? "x" : "o";

	if (!userStarts) {
		try {
			const response = await axios.post(`${ENGINE_URI}/next_move`, {
				board,
				current_player: "o",
			});
			board = response.data.board;
			current_player = response.data.next_player;
		} catch (err) {
			console.error(err);
			return res.status(500).json({ error: "Engine error" });
		}
	}

	await GameSession.findOneAndDelete({ user });
	await new GameSession({ user, board, current_player }).save();

	res.json({ board, current_player });
});

app.get("/game/status", auth, async (req, res) => {
	try {
		await connectDB();
	} catch (error) {
		console.error("Database connection error:", error);
		return res.status(500).json({ message: "Database connection error" });
	}
	const GameSession = mongoose.model("GameSession", gamesSchema);

	const user = req.user.id;
	const session = await GameSession.findOne({ user });
	if (!session) return res.status(404).json({ error: "No game session" });

	const response = await axios.post(`${ENGINE_URI}/game_status`, {
		board: session.board,
	});

	res.json({
		board: session.board,
		game_status: response.data.game_status,
		current_player: session.current_player,
	});
});

app.post("/game/move", auth, async (req, res) => {
	try {
		await connectDB();
	} catch (error) {
		console.error("Database connection error:", error);
		return res.status(500).json({ message: "Database connection error" });
	}

	const User = mongoose.model("User", userSchema);
	const GameSession = mongoose.model("GameSession", gamesSchema);

	const user = req.user.id;
	const { row, col } = req.body;

	const session = await GameSession.findOne({ user });
	if (!session) return res.status(400).json({ error: "No active session" });
	const myUser = await User.findById(user);

	let board = session.board;
	let current_player = session.current_player;

	// Validate user's move
	if (board[row][col] !== 0)
		return res.status(400).json({ error: "Invalid move" });
	board[row][col] = current_player === "x" ? -1 : 1;

	// Check if game ended after user move and remove session if game ended
	try {
		const gameStatus = await axios.post(`${ENGINE_URI}/game_status`, { board });
		if (gameStatus.data.game_status !== "ongoing") {
			await GameSession.deleteOne({ user });

			if (gameStatus.data.game_status.includes("winner")) {
				myUser.stats.wins++;
			} else if (gameStatus.data.game_status === "draw") {
				myUser.stats.draws++;
			}
			await myUser.save();

			return res.json({ board, game_status: gameStatus.data.game_status });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Engine error" });
	}

	// Engine makes move
	try {
		const computerMove = await axios.post(`${ENGINE_URI}/next_move`, {
			board,
			current_player: current_player === "x" ? "o" : "x",
		});

		board = computerMove.data.board;
		current_player = computerMove.data.next_player;
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Engine error" });
	}

	// Final status check
	try {
		const gameStatusAfter = await axios.post(`${ENGINE_URI}/game_status`, {
			board,
		});
		if (gameStatusAfter.data.game_status !== "ongoing") {
			await GameSession.deleteOne({ user });
			if (gameStatusAfter.data.game_status.includes("winner")) {
				myUser.stats.losses++;
			} else if (gameStatusAfter.data.game_status === "draw") {
				myUser.stats.draws++;
			}
			await myUser.save();

			return res.json({ board, game_status: gameStatusAfter.data.game_status });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Engine error" });
	}

	await GameSession.updateOne({ user }, { board, current_player });
	res.json({
		board,
		game_status: "ongoing",
		current_player: current_player,
	});
});

app.get("/user/stats", auth, async (req, res) => {
	try {
		await connectDB();
	} catch (error) {
		console.error("Database connection error:", error);
		return res.status(500).json({ message: "Database connection error" });
	}

	const User = mongoose.model("User", userSchema);

	const user = req.user.id;
	const myUser = await User.findById(user);
	res.json({ user: myUser.email, stats: myUser.stats });
});

app.listen(3000, () => console.log("Backend server on http://localhost:3000"));
