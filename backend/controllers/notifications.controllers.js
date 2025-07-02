const path = require("path");
const db = require("../config/db");

exports.createNotification = async (req, res) => {
    try {
        const { team_member_id, content } = req.body;
        if (!team_member_id || !content)
            return res.status(400).json({ message: "Missing fields" });

        const [result] = await db.execute(
            `INSERT INTO notifications (team_member_id, content) VALUES (?, ?)`,
            [team_member_id, content]
        );

        res.status(201).json({ message: "Notification created", notificationId: result.insertId });
    } catch (err) {
        console.error("Create notification error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
