const axios = require('axios');

// Số lượng group cần tạo
const totalGroups = 10000;

// URL chính xác của API
const apiUrl = 'http://localhost:5000/api/v1/group/create';

// Hàm sinh dữ liệu group
function generateGroup(i) {
    return {
        name: `Group ${i}`,
        description: `Group for project number ${i}`
    };
}

// Gửi 1 nhóm
async function createGroup(group) {
    try {
        const res = await axios.post(apiUrl, group, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`✅ Created: ${group.name}`);
    } catch (err) {
        console.error(`❌ Failed: ${group.name}`, err.response?.data || err.message);
    }
}

// Chạy vòng lặp để gửi từng nhóm
(async () => {
    for (let i = 1; i <= totalGroups; i++) {
        const group = generateGroup(i);
        await createGroup(group); // Nếu muốn nhanh hơn, có thể gửi theo batch
    }
})();
