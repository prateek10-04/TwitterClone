// post.js

document.getElementById('post-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const tweetContent = document.getElementById('tweet-content').value;

    try {
        const response = await fetch('/tweets/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({ content: tweetContent }),
        });

        if (response.ok) {
            console.log('Tweet posted successfully:', await response.json());
            // Redirect to the dashboard or take other actions as needed
            window.location.href = 'dashboard.html';
        } else {
            console.error('Error posting tweet:', response.statusText);
            // Display an error message or take appropriate action
        }
    } catch (error) {
        console.error('Error posting tweet:', error.message);
        // Handle any network or other errors
    }
});
