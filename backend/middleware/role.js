const db = require('../config/db');

exports.isTeamAdmin = async (req, res, next) => {
    const userId = req.user.id;
    const { teamId } = req.body;

    if (!teamId) return res.status(400).json({ message: "Missing teamId" });

    try {
        const [rows] = await db.execute(
            `SELECT role FROM team_members WHERE user_id = ? AND team_id = ?`,
            [userId, teamId]
        );

        if (rows.length === 0)
            return res.status(403).json({ message: "You are not a member of this team" });

        if (rows[0].role !== 'admin')
            return res.status(403).json({ message: "You are not an admin of this team" });

        next();
    } catch (err) {
        console.error("isTeamAdmin error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
