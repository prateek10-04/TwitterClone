document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`/tweets/${localStorage.getItem('tweetID')}`, {
            method:'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (response.ok) {
            const tweet = await response.json();
            console.log(tweet)
            const tweetContent = tweet.content;

            // Set the original tweet content in the textarea
            document.getElementById('tweet-content').value = tweetContent;
        } else {
            console.error('Error fetching original tweet:', response.statusText);
            // Display an error message or take appropriate action
        }
    } catch (error) {
        console.error('Error fetching original tweet:', error.message);
        // Handle any network or other errors
    }
});

document.getElementById('update-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const tweetContent = document.getElementById('tweet-content').value;

    try {
        const response = await fetch(`/tweets/update/${localStorage.getItem('tweetID')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({ content: tweetContent }),
        });

        if (response.ok) {
            console.log('Tweet updated successfully:', await response.json());
            // Redirect to the dashboard or take other actions as needed
            window.location.href = 'dashboard.html';
        } else {
            console.error('Error updating tweet:', response.statusText);
            // Display an error message or take appropriate action
        }
    } catch (error) {
        console.error('Error updating tweet:', error.message);
        // Handle any network or other errors
    }
});
