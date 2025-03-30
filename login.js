
// Configure AWS with your access and secret key
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAW5BDRDVAIR7HX7K5', 
    secretAccessKey: 'gsZwfY8x1SlhySx1kFv034B5xzYV1U0uFBPWeZvM'
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Function to log in a user
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Login function called with:', username);

    const params = {
        TableName: 'Logins',
        Key: { Username: username }
    };

    try {
        const result = await dynamoDB.get(params).promise();

        if (result.Item && result.Item.Password === password) {
            console.log('Login successful!');
            localStorage.setItem('userId', username); // Store user ID
            sessionStorage.setItem('userId', username); // Store session ID
            await loadUserPreferences(username); // Load user-specific preferences
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        } else {
            console.error('Invalid username or password');
            alert('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in:', error.message || error);
        alert('Login failed. Please try again.');
    }
}

// Function to sign up a new user
async function signUp() {
    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;
    console.log('Sign up function called with:', username);

    const params = {
        TableName: 'Logins',
        Item: {
            Username: username,
            Password: password, // Hash in production
            Preferences: {} // Store empty preferences initially
        }
    };

    try {
        await dynamoDB.put(params).promise();
        console.log('Sign up successful!');
        alert('Account created successfully! Please log in.');
        document.getElementById('signUpForm').style.display = 'none'; // Hide sign-up form
    } catch (error) {
        console.error('Error signing up user:', error.message || error);
        alert('Sign up failed. Please try again.');
    }
}

// Function to clear user data (on login/logout page load)
function clearUserData() {
    console.log("Clearing user session and preferences...");
    localStorage.clear(); // Clear all local storage data
    sessionStorage.clear(); // Clear session storage
}

// Clear data when loading the login/logout page
window.onload = function() {
    const isLoginPage = window.location.pathname.includes("index.html"); // Adjust for actual login page filename
    const isLogoutPage = window.location.pathname.includes("logout.html"); // Adjust for actual logout page filename
    if (isLoginPage || isLogoutPage) {
        clearUserData();
    }
};

// Function to save user preferences to DynamoDB
async function saveUserPreferences(username, preferences) {
    const params = {
        TableName: 'Logins',
        Key: { Username: username },
        UpdateExpression: "set Preferences = :prefs",
        ExpressionAttributeValues: {
            ":prefs": preferences
        }
    };

    try {
        await dynamoDB.update(params).promise();
        console.log("User preferences saved.");
    } catch (error) {
        console.error("Error saving preferences:", error.message || error);
    }
}

// Function to load user preferences from DynamoDB
async function loadUserPreferences(username) {
    const params = {
        TableName: 'Logins',
        Key: { Username: username }
    };

    try {
        const result = await dynamoDB.get(params).promise();
        if (result.Item && result.Item.Preferences) {
            localStorage.setItem("preferences", JSON.stringify(result.Item.Preferences));
            console.log("User preferences loaded.");
        }
    } catch (error) {
        console.error("Error loading preferences:", error.message || error);
    }
}

// Function to log out a user
function logout() {
    clearUserData();
    window.location.href = 'index.html'; // Redirect to login page
}
