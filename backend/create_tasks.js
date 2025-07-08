const axios = require('axios');

const totalUsers = 20252;
const tasksPerUser = 10;
const apiUrl = 'http://localhost:5000/api/v1/task/create';

// Tính team_id từ user_id (mỗi team có 4 người)
function getTeamIdFromUserId(userId) {
    return Math.floor((userId - 1) / 4) + 1;
}

// Hàm tạo dữ liệu task
function generateTask(userId, taskIndex) {
    const teamId = getTeamIdFromUserId(userId);

    return {
        team_id: teamId,
        created_by_team_member_id: userId,
        title: `Task ${taskIndex + 1} của User ${userId}`,
        description: `Tự động tạo task số ${taskIndex + 1} cho user ${userId}`,
        due_date: generateRandomDate()
    };
}

// Tạo ngày đến hạn ngẫu nhiên
function generateRandomDate() {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 30) + 1;
    today.setDate(today.getDate() + randomDays);
    return today.toISOString().split('T')[0];
}

// Gửi task
async function createTask(task) {
    try {
        await axios.post(apiUrl, task, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`✅ Created: ${task.title}`);
    } catch (err) {
        console.error(`❌ Failed: ${task.title}`, err.response?.data || err.message);
    }
}

// Chạy tất cả
(async () => {
    for (let userId = 1; userId <= totalUsers; userId++) {
        for (let i = 0; i < tasksPerUser; i++) {
            const task = generateTask(userId, i);
            await createTask(task); // Chạy từng cái và không dừng nếu lỗi
        }
    }
})();
