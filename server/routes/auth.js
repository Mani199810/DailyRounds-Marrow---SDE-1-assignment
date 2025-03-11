import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import passport from "passport";
import "../config/passport.js";
import { body, validationResult } from "express-validator";

const router = express.Router();
const generateToken = (user) =>
	jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
router.post(
	"/register",
	[
		body("name").notEmpty().withMessage("Name is required"),
		body("email")
			.isEmail()
			.normalizeEmail()
			.withMessage("Invalid email"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters"),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			const sampleUsers = await User.find({ isSample: true });
			if (sampleUsers.length === 0) {
				const sampleUsers = [
					{ name: 'Raghu', email: 'raghu@example.com', password: 'password123' },
					{ name: 'Naveen', email: 'naveen@example.com', password: 'password123' },
					{ name: 'Veena', email: 'veen@example.com', password: 'password123' },
					{ name: 'Diana', email: 'diana@example.com', password: 'password123' },
					{ name: 'Eve', email: 'eve@example.com', password: 'password123' }
				];

				const sampleUsersPromises = sampleData.map(async (user) => {
					const hashedPassword = await bcrypt.hash(user.password, 10);
					return new User({ ...user, password: hashedPassword }).save();
				});

				await Promise.all(sampleUsersPromises);
			}

			let user = await User.findOne({ email });
			if (user) return res.status(400).json({ message: "User already exists" });

			const hashedPassword = await bcrypt.hash(password, 10);
			user = new User({ name, email, password: hashedPassword });

			await user.save();

			const token = generateToken(user);

			res.cookie("token", token, { httpOnly: true, secure: true }).json({
				message: "User registered and logged in successfully",
				user: { token, name: user.name, email: user.email },
			});
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
);


router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	const sampleUsers = [
		{ name: 'Raghu', email: 'raghu@example.com', password: 'password123' },
		{ name: 'Naveen', email: 'naveen@example.com', password: 'password123' },
		{ name: 'Veena', email: 'veen@example.com', password: 'password123' },
		{ name: 'Diana', email: 'diana@example.com', password: 'password123' },
		{ name: 'Eve', email: 'eve@example.com', password: 'password123' }
	];

	try {
		for (const sampleUser of sampleUsers) {
			const existingUser = await User.findOne({ email: sampleUser.email });
			if (!existingUser) {
				const hashedPassword = await bcrypt.hash(sampleUser.password, 10);
				await User.create({ ...sampleUser, password: hashedPassword });
			}
		}

		const user = await User.findOne({ email }).select("+password");
		if (!user) return res.status(400).json({ message: "User not found" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

		const token = generateToken(user);
		res.cookie("token", token, { httpOnly: true }).json({
			message: "Logged in successfully",
			user: { token, name: user.name, email: user.email },
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});


router.get("/logout", (req, res) => {
	res.clearCookie("token").json({ message: "Logged out successfully" });
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
	"/google/callback",
	passport.authenticate("google", { session: false }),
	(req, res) => {
		const token = generateToken(req.user);
		res.cookie("token", token, { httpOnly: true }).redirect(
			process.env.GOOGLE_CALLBACK_URL
		);
	}
);

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ isSample: false }).select('name email');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
