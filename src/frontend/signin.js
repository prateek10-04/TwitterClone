// Define the API endpoint for user signin
const signinEndpoint = '/users/signup';
let display=''
// Event listener for the signin form submission
document.getElementById('signin-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the user input from the form
    const userName = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Make a POST request to the signin endpoint
        const response = await fetch(signinEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName ,email, password }),
        });

        // Parse the response
        const data = await response.json();
        console.log({'hello':data})
        if (response.ok) {
            // Successful signin
            console.log('Signed in successfully:', data);
            localStorage.setItem('authToken', data.token);
            // You can redirect the user or perform other actions as needed

            window.location.href = 'dashboard.html';
        } else {
            // Signin failed
            console.error('Signin failed:', data.message);

            // Display an error message or take appropriate action
            const errorMessageContainer = document.getElementById('error-message');
            errorMessageContainer.textContent = data.message; // Display the error message
            errorMessageContainer.style.color = 'red'; // Change the color to red or apply your own styling
            document.getElementById('userName').value=''
            document.getElementById('email').value=''
            document.getElementById('password').value=''
            // Clear the error message after a few seconds (optional)
            setTimeout(() => {
                errorMessageContainer.textContent = '';
            }, 3000);

        }
    } catch (error) {
        console.error('Error during signin:', error.message);
        // Handle any network or other errors
    }
});