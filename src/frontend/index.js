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
        tweets.reverse().forEach(tweet => {
            const tweetElement = document.createElement('div');
            tweetElement.classList.add('tweet-box'); // Add the tweet-box class

            tweetElement.innerHTML = `
                <p class="tweet-author"><strong>${tweet.author}</strong></p>
                <p>${tweet.content}</p>
                <p class="tweet-date">${tweet.date}</p>
            `;
            tweetsContainer.appendChild(tweetElement);
        });
    } catch (error) {
        console.error('Error fetching tweets:', error.message);
    }
}

// Event listeners for the Sign In and Log In buttons
document.getElementById('signin-btn').addEventListener('click', () => {
    // Redirect or show the sign-in page as needed
    console.log('Sign In button clicked');
    window.location.href='signin.html'
});

document.getElementById('login-btn').addEventListener('click', () => {
    // Redirect to the login page
    window.location.href = 'login.html';
});




document.getElementById('google-btn').addEventListener('click', async () => {
    localStorage.setItem('google_sign',true)
    // Redirect to the login page
   window.location.href='/auth/google'
   
});

// Load tweets when the page loads
document.addEventListener('DOMContentLoaded',async()=>{
    displayTweets()
    localStorage.setItem('google_sign',false)
    
    const response = await fetch('/failed');
    if(response.ok){
        const data = await response.json()
        console.log(data)
        if(data.message){
        const confirmation = window.confirm(data.message);
        }
    }
});



