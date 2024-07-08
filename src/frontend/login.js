// Define the API endpoint for user login
const loginEndpoint = '/users/login';
let display=''
// Event listener for the login form submission
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the user input from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Make a POST request to the login endpoint
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Parse the response
        const data = await response.json();
        console.log({'hello':data})
        if (response.ok) {
            // Successful login
            console.log('Logged in successfully:', data);
            localStorage.setItem('authToken', data.token);
            // You can redirect the user or perform other actions as needed

            window.location.href = 'dashboard.html';
        } else {
            // Login failed
            console.error('Login failed:', data.message);

            // Display an error message or take appropriate action
            const errorMessageContainer = document.getElementById('error-message');
            errorMessageContainer.textContent = data.message; // Display the error message
            errorMessageContainer.style.color = 'red'; // Change the color to red or apply your own styling
            document.getElementById('email').value=''
            document.getElementById('password').value=''
            // Clear the error message after a few seconds (optional)
            setTimeout(() => {
                errorMessageContainer.textContent = '';
            }, 3000);

        }
    } catch (error) {
        console.error('Error during login:', error.message);
        // Handle any network or other errors
    }
});