// profile.js
document.addEventListener('DOMContentLoaded', async () => {
    await displayAccountInfo();
});

async function displayAccountInfo() {
    try {
        const response = await fetch('/users/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const profileInfoContainer = document.getElementById('profile-info-container');
            profileInfoContainer.innerHTML = `
                <p><strong>Username:</strong> ${data.user.userName}</p>
                <p><strong>Email:</strong> ${data.user.email}</p>
            `;
        } else {
            console.error('Error getting account information:', response.statusText);
        }
    } catch (error) {
        console.error('Error getting account information:', error.message);
    }
}
