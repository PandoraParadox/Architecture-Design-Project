const path = require("path");
const db = require("../config/db");

exports.createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: "Missing group name" });

        const [result] = await db.execute(
            "INSERT INTO teams (name, description) VALUES (?, ?)",
            [name, description || null]
        );

        res.status(201).json({ message: "Group created", teamId: result.insertId });
    } catch (err) {
        console.error("Create group error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.addUserToTeam = async (req, res) => {
    try {
        const { user_id, team_id, role } = req.body;

        if (!user_id || !team_id)
            return res.status(400).json({ message: "Missing user_id or team_id" });

        const memberRole = role === "admin" ? "admin" : "member";

        const [exist] = await db.execute(
            `SELECT * FROM team_members WHERE user_id = ? AND team_id = ?`,
            [user_id, team_id]
        );
        if (exist.length > 0)
            return res.status(409).json({ message: "User already in team" });

        const [result] = await db.execute(
            `INSERT INTO team_members (user_id, team_id, role) VALUES (?, ?, ?)`,
            [user_id, team_id, memberRole]
        );

        res.status(201).json({ message: "User added to team", member_id: result.insertId });
    } catch (err) {
        console.error("Add user to team error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

