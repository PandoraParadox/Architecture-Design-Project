const path = require("path");
const db = require("../config/db");

exports.createTask = async (req, res) => {
    try {
        const {
            team_id,
            created_by_team_member_id,
            title,
            description,
            due_date,
        } = req.body;

        if (!team_id || !created_by_team_member_id || !title || !due_date)
            return res.status(400).json({ message: "Missing required fields" });

        const currentDate = new Date();
        const dueDate = new Date(due_date);
        const diffTime = dueDate - currentDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        let priority = "low";
        if (diffDays < 1) priority = "high";
        else if (diffDays < 3) priority = "medium";

        const [result] = await db.execute(
            `INSERT INTO tasks (team_id, created_by_team_member_id, title, description, due_date, priority)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                team_id,
                created_by_team_member_id,
                title,
                description || null,
                due_date,
                priority,
            ]
        );

        res.status(201).json({ message: "Task created", taskId: result.insertId });
    } catch (err) {
        console.error("Create task error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.assignTask = async (req, res) => {
    const { task_id, team_member_id } = req.body;

    if (!task_id || !team_member_id)
        return res.status(400).json({ message: "Missing task_id or team_member_id" });

    try {
        const [task] = await db.execute("SELECT id FROM tasks WHERE id = ?", [task_id]);
        const [member] = await db.execute("SELECT id FROM team_members WHERE id = ?", [team_member_id]);

        if (task.length === 0 || member.length === 0)
            return res.status(404).json({ message: "Task or team member not found" });

        await db.execute(
            `INSERT INTO task_assignments (task_id, team_member_id) VALUES (?, ?)`,
            [task_id, team_member_id]
        );

        res.status(201).json({ message: "Task assigned successfully" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Task already assigned to this member" });
        }
        console.error("Assign task error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.acceptTask = async (req, res) => {
    const { task_id, team_member_id } = req.body;

    if (!task_id || !team_member_id)
        return res.status(400).json({ message: "Missing task_id or team_member_id" });

    try {
        const [rows] = await db.execute(
            `SELECT * FROM task_assignments WHERE task_id = ? AND team_member_id = ?`,
            [task_id, team_member_id]
        );

        if (rows.length === 0)
            return res.status(404).json({ message: "Assignment not found" });

        await db.execute(
            `UPDATE task_assignments SET accepted = TRUE, accepted_at = NOW()
       WHERE task_id = ? AND team_member_id = ?`,
            [task_id, team_member_id]
        );

        res.status(200).json({ message: "Task accepted successfully" });
    } catch (err) {
        console.error("Accept task error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const [task] = await db.execute("SELECT id FROM tasks WHERE id = ?", [id]);
        if (task.length === 0)
            return res.status(404).json({ message: "Task not found" });

        await db.execute("DELETE FROM tasks WHERE id = ?", [id]);

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("Delete task error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.completeTask = async (req, res) => {
    const { id } = req.params;

    try {
        const [task] = await db.execute("SELECT * FROM tasks WHERE id = ?", [id]);
        if (task.length === 0)
            return res.status(404).json({ message: "Task not found" });

        await db.execute("UPDATE tasks SET status = 'done' WHERE id = ?", [id]);

        res.status(200).json({ message: "Task marked as completed" });
    } catch (err) {
        console.error("Complete task error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getTaskDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const [taskRows] = await db.execute(
            `SELECT t.*, tm.id AS creator_member_id, u.name AS creator_name
       FROM tasks t
       JOIN team_members tm ON t.created_by_team_member_id = tm.id
       JOIN users u ON tm.user_id = u.id
       WHERE t.id = ?`,
            [id]
        );
        if (taskRows.length === 0)
            return res.status(404).json({ message: "Task not found" });

        const task = taskRows[0];

        const [assignees] = await db.execute(
            `SELECT tm.id AS team_member_id, u.name AS user_name, tm.role, ta.accepted, ta.accepted_at
       FROM task_assignments ta
       JOIN team_members tm ON ta.team_member_id = tm.id
       JOIN users u ON tm.user_id = u.id
       WHERE ta.task_id = ?`,
            [id]
        );

        const [comments] = await db.execute(
            `SELECT c.id, c.content, c.created_at, u.name AS user_name
       FROM comments c
       JOIN team_members tm ON c.team_member_id = tm.id
       JOIN users u ON tm.user_id = u.id
       WHERE c.task_id = ?
       ORDER BY c.created_at ASC`,
            [id]
        );

        res.status(200).json({
            task: {
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                due_date: task.due_date,
                priority: task.priority,
                created_at: task.created_at,
                created_by: {
                    id: task.creator_member_id,
                    name: task.creator_name
                }
            },
            assignees,
            comments
        });
    } catch (err) {
        console.error("Get task detail error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
