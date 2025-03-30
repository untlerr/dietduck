// Load environment variables from .env file
require('dotenv').config();  

// Import necessary modules
const express = require('express');
const axios = require('axios');
const path = require('path');

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the root path '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'Server is working!' });
});

// Endpoint to handle requests from the frontend
app.post('/api/chat', async (req, res) => {
    const userInput = req.body.input;
    const conversationHistory = req.body.history || [];

    if (!userInput) {
        return res.status(400).json({ error: 'User input is required' });
    }

    const systemPrompt = `
    You are a helpful dietician assistant. Whenever you are given a prompt, your response is a JSON object. 
    All your responses are based on inputted user preferences about their food preferences.
    Collect and create a profile for the user based on input data.

    You follow this JSON template, for each category. (Substitute user-parameters for data given. If no data is found, do not include the category)
    If the user is halal, then their dietary restrictions are halal only.:
    {
        "name": "user name",
        "height": "user-height",
        "gender": "user-gender",
        "dietary_restrictions": "dietary restrictions such as allergies, halal food, etc.",
        "weight": "user weight",
        "dislikes": "dislikes"
    }
    `;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map((msg) => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: userInput },
    ];
    
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: messages,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const assistantResponse = response.data.choices[0].message.content;

        try {
            // Add the new message to the history
            const jsonResponse = JSON.parse(assistantResponse);
            return res.json({ 
                response: jsonResponse,
                history: [
                    ...conversationHistory,
                    { role: 'user', content: userInput },
                    { role: 'assistant', content: assistantResponse }
                ]
            });
        } catch (jsonError) {
            return res.status(500).json({ 
                error: 'Invalid JSON response from assistant', 
                raw_response: assistantResponse 
            });
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Open your browser and navigate to http://localhost:${port}`);
});