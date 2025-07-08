const axios = require('axios');

const totalGroups = 10000;
const usersPerGroup = 4;
const totalUsers = totalGroups * usersPerGroup;
const apiUrl = 'http://localhost:5000/api/v1/group/add-member';

// Tạo danh sách member cho 1 group
function generateMembersForGroup(groupId, startUserId) {
    const members = [];

    for (let i = 0; i < usersPerGroup; i++) {
        members.push({
            team_id: groupId,
            user_id: startUserId + i,
            role: i === 0 ? 'admin' : 'member'
        });
    }

    return members;
}

// Gửi request thêm 1 member vào group
async function addMemberToGroup(member) {
    try {
        await axios.post(apiUrl, member, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`✅ Added user ${member.user_id} to team ${member.team_id} as ${member.role}`);
    } catch (err) {
        console.error(`❌ Failed user ${member.user_id} to team ${member.team_id}:`, err.response?.data || err.message);
    }
}

// Gửi cho tất cả nhóm
(async () => {
    let currentUserId = 1;

    for (let groupId = 1; groupId <= totalGroups; groupId++) {
        const members = generateMembersForGroup(groupId, currentUserId);

        for (const member of members) {
            await addMemberToGroup(member); // Gửi từng người
        }

        currentUserId += usersPerGroup;
    }
})();
