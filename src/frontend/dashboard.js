// Dashboard.js
async function getLoggedInUsername() {
    try {

        const response = await fetch('/users/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
        

        if (response.ok) {
            const data = await response.json();
            return data.user.userName;
        } else {
            console.error('Error getting logged-in username:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error getting logged-in username:', error.message);
        return null;
    }
}
// Define the API endpoint for fetching tweets
const tweetsEndpoint = '/tweets';

// Function to fetch and display tweets
async function displayTweets() {
    try {
        const response = await fetch(tweetsEndpoint);
        const tweets = await response.json();

        // Display tweets in the tweets-container
        const tweetsContainer = document.getElementById('tweets-container');
        tweetsContainer.innerHTML = '';

        // Reverse the array to display new tweets at the top
        tweets.reverse().forEach(async tweet => {
            const tweetElement = document.createElement('div');
            tweetElement.classList.add('tweet-box'); // Add the tweet-box class
            const isAuthor = tweet.author === await getLoggedInUsername();

            tweetElement.innerHTML = `
                <p class="tweet-author"><strong>${tweet.author}</strong></p>
                <p>${tweet.content}</p>
                <p class="tweet-date">${tweet.date}</p>
                ${isAuthor ? `<button class="update-button" onclick="updateTweet('${tweet._id}')">Update</button>` : ''}
                ${isAuthor ? `<button class="delete-button" onclick="deleteTweet('${tweet._id}')">Delete</button>` : ''}
            `;
            tweetsContainer.appendChild(tweetElement);
        });

        // Display welcome message with username
        const welcomeMessage = document.getElementById('welcome-message');
        console.log("Hello message"+await getLoggedInUsername())
        const username = await getLoggedInUsername(); // Use the function to get the username
        welcomeMessage.textContent = `Welcome, ${username}`;
    } catch (error) {
        console.error('Error fetching tweets:', error.message);
    }
}
async function setlocal(){
    localStorage.setItem('google_sign',false)

   try {const response = await fetch('/success');
    if(response.ok){
        const data = await response.json()
        console.log(data)
        if(data.token1){localStorage.setItem('authToken',data.token1)}
    }}
    catch(e){console.log(e)}
    
}



// Event listener for the Post button
document.getElementById('post-button').addEventListener('click', () => {
    // Redirect or show the post page as needed
    console.log('Post button clicked');
    // You can redirect to a post page or display a modal for posting
    window.location.href = 'post.html';
});

document.getElementById('profile-button').addEventListener('click', () => {
    // Redirect to the profile page
    window.location.href = 'profile.html';
});

document.getElementById('logout-button').addEventListener('click', async () => {
    // Redirect or show the post page as needed
    console.log('Logout button clicked');
    const confirmation = window.confirm('Do you really want to logout?');

    if (confirmation) {
        // If the user confirms, proceed with the logout
       await performLogout();
    } else {
        // If the user cancels, do nothing
        console.log('Logout canceled');
    }
    // You can redirect to a post page or display a modal for posting
    
});
async function performLogout(){
    try{
        const response = await fetch('/users/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
        if(response.ok){
            console.log('Logged out successfully');
            // Redirect to the home page after logout
            window.location.href = 'index.html';
        }else {
            console.error('Error logging out:', response.statusText);
        }
    }catch (error) {
        console.error('Error logging out:', error.message);
    }
}

// Load tweets and welcome message when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log(localStorage.getItem('google_sign'))
    console.log(localStorage.getItem('authToken'))
    console.log(await getLoggedInUsername())
    if(localStorage.getItem('google_sign')!=='false'){
        await setlocal()
    }
    await displayTweets();
});

// Function to handle updating a tweet
function updateTweet(tweetId) {
    localStorage.setItem('tweetID',tweetId)
    // Implement update functionality here
    console.log('Update button clicked for tweet ID:', tweetId);
    window.location.href='update.html'
}

// Function to handle deleting a tweet
// Function to handle deleting a tweet
function deleteTweet(tweetId) {
    // Implement delete functionality here
    const confirmation = window.confirm('Do you really want to delete the tweet?');

    if (confirmation) {
        // If the user confirms, proceed with the deletion
        performTweetDeletion(tweetId);
    } else {
        // If the user cancels, do nothing
        console.log('Deletion canceled');
    }
}

// Function to perform the actual tweet deletion
async function performTweetDeletion(tweetId) {
    try {
        const response = await fetch(`/tweets/delete/${tweetId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (response.ok) {
            console.log('Tweet deleted successfully');
            // Reload the tweets after deletion
            await displayTweets();
        } else {
            console.error('Error deleting tweet:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting tweet:', error.message);
    }
}


// Function to retrieve the logged-in username

