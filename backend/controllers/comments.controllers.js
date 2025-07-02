const path = require("path");
const db = require("../config/db");

exports.createComment = async (req, res) => {
    try {
        const { task_id, team_member_id, content } = req.body;

        if (!task_id || !team_member_id || !content)
            return res.status(400).json({ message: "Missing fields" });

        const [result] = await db.execute(
            `INSERT INTO comments (task_id, team_member_id, content) VALUES (?, ?, ?)`,
            [task_id, team_member_id, content]
        );

        res.status(201).json({ message: "Comment added", commentId: result.insertId });
    } catch (err) {
        console.error("Create comment error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
