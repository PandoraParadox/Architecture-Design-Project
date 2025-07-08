const axios = require('axios');

const totalUsers = 500000;
const batchSize = 1000; // Gửi 1000 user/lần để tránh nghẽn

const apiUrl = 'http://localhost:5000/api/v1/user/create';

function generateUser(i) {
    return {
        name: `User_${i}`,
        email: `user${i}@example.com`,
        password: 'defaultpass123'
    };
}

async function sendUser(user) {
    try {
        const res = await axios.post(apiUrl, user, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`✅ Created: ${user.email}`);
    } catch (err) {
        console.error(`❌ Failed: ${user.email}`, err.response?.data || err.message);
    }
}

async function run() {
    for (let i = 1; i <= totalUsers; i++) {
        const user = generateUser(i);
        await sendUser(user); // ❗ Gửi từng user một => CHẬM nhưng an toàn

        // Nếu muốn gửi nhanh hơn, bạn có thể gửi song song từng batch:
        // if (i % batchSize === 0) console.log(`✔️ Sent ${i} users`);
    }
}

run();
