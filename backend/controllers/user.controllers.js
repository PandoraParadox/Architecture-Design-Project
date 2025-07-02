const path = require("path");
const db = require("../config/db");
const bcrypt = require("bcrypt");
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "Missing fields" });
        const [existing] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );
        if (existing.length > 0)
            return res.status(409).json({ message: "Email already in use" });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await db.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: "User created", userId: result.insertId });
    } catch (err) {
        console.error("Create user error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Missing email or password" });
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0)
            return res.status(401).json({ message: "Invalid credentials" });

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};