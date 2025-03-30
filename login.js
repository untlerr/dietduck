


// Configure AWS with your access and secret key
AWS.config.update({
    region: 'us-east-1', // e.g., 'us-east-1'
    accessKeyId: 'AKIAW5BDRDVAIR7HX7K5', 
    secretAccessKey: 'gsZwfY8x1SlhySx1kFv034B5xzYV1U0uFBPWeZvM' 
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Login function called with:', username);

    const params = {
        TableName: 'Logins',
        Key: {
            Username: username
        }
    };

    try {
        const result = await dynamoDB.get(params).promise();

        if (result.Item && result.Item.Password === password) {
            console.log('Login successful!');
            window.location.href = 'dashboard.html';
        } else {
            console.error('Invalid username or password');
            alert('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in:', error.message || error);
        alert('Login failed. Please try again.');
    }
}

async function signUp() {
    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;
    console.log('Sign up function called with:', username);

    const params = {
        TableName: 'Logins',
        Item: {
            Username: username,
            Password: password // Hash this in a production environment
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