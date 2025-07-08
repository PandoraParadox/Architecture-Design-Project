const axios = require('axios');

const totalTasks = 51000;
const maxUserId = 21000;
const apiUrl = 'http://localhost:5000/api/v1/task/assign';

// Hàm tạo user ngẫu nhiên trong 1–21000
function getRandomUserId() {
    return Math.floor(Math.random() * maxUserId) + 1;
}

// Gửi 1 task
async function assignTask(taskId, teamMemberId) {
    const data = {
        task_id: taskId,
        team_member_id: teamMemberId
    };

    try {
        await axios.post(apiUrl, data, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`✅ Assigned task ${taskId} → member ${teamMemberId}`);
    } catch (err) {
        console.error(`❌ Failed task ${taskId} → member ${teamMemberId}`, err.response?.data || err.message);
    }
}

// Gán toàn bộ task
(async () => {
    for (let taskId = 1; taskId <= totalTasks; taskId++) {
        const teamMemberId = getRandomUserId();
        await assignTask(taskId, teamMemberId);
    }
})();
