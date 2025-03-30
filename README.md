# Diet Duck

## Team Members
- Aiden McManus.
- Sydney Faranetta
- Emmanuel Owusu
- Adrian Lee

## Project Description
Diet Duck is a personalized campus dining assistant designed to help students make informed dietary choices. The application analyzes campus dining options based on user preferences, dietary restrictions, Stevens food macrodata, and nutritional goals to provide tailored meal suggestions.

### Key Features
- **Personalized Meal Recommendations**: Offers suggestions based on user preferences, dietary restrictions, and nutritional goals
- **Campus Dining Integration**: Scrapes real-time menu data from the Dine on Campus website
- **Interactive Campus Map**: Displays dining locations on campus with interactive bubbles
- **Comprehensive Preference System**: Allows users to set protein, grain, dairy, and vegetable preferences with us of an AI agent
- **Dietary Restriction Support**: Accommodates allergies, halal requirements, and other dietary needs
- **AI-Powered Feedback**: "Attila" chatbot agent provides personalized nutrition advice

## Problem Solved
College students often struggle with maintaining healthy eating habits due to limited dining options and busy schedules. Diet Duck bridges this gap by simplifying the decision-making process around campus dining, ensuring users can quickly find meals that match their dietary needs and preferences without compromising on nutrition or taste.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: AWS DynamoDB
- **Authentication**: BCrypt for password hashing
- **Cloud Services**: AWS IAM for user management
- **AI Integration**: Custom AI model for meal suggestions and nutritional feedback
- **Data Processing**: Custom data scraping and cleaning tools for dining information

## Setup and Usage
1. Clone the repository
2. Install dependencies with `npm install`
3. Configure AWS credentials (instructions in configuration file)
4. Start the application with `npm start`
5. Access the application at `http://localhost:3000`

## User Flow
1. **Login/Sign Up**: Create an account or log in to an existing account
2. **Set Preferences**: Configure dietary restrictions, allergies, and food preferences
4. **Get Recommendations**: Receive personalized meal suggestions based on open restaurants
4. **View Campus Map**: Locate dining options on the interactive Stevens campus map
5. **Chat with Attila**: Get AI-powered nutritional advice and feedback

## Screenshots
![image](https://github.com/user-attachments/assets/ae5d1edc-cc41-4228-9636-9781e888c16a)
![image](https://github.com/user-attachments/assets/52a581c7-2182-42b2-871d-bc13d41fd61a)
![image](https://github.com/user-attachments/assets/1395d957-0005-4803-9126-62a58415e4d4)
![image](https://github.com/user-attachments/assets/cdc2f1f9-929b-4a15-891c-eaf1c2f4b51e)




## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Development
- Integration with additional campus dining systems
- Expanded nutritional tracking features
- Social sharing capabilities
- Advanced meal planning functionality
