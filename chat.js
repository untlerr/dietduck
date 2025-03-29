import OpenAi from "openai";
import readline from "readline"
import dotenv from "dotenv"

dotenv.config();


const openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

// system instructions
const systemMessage = "You are a helpful dietician assistant. Whenever you are given a prompt,  your response is a JSON object. All your responses are based on inputted user preferences about their food preferences. Collect and create a profile for the user based on input data. You follow this JsON template, for each category. (Substitute user-parameters for data given. If no data is found, do not include the category). For example, if the user is halal, then their dietary restrictions are halal only.: 'name': 'user name',\
'height': 'user-height',\
  'gender': 'user-gender',\
  'Dietary restrictions': 'dietary restrictions such as allergies, halal food, etc. :\
  'Weight': 'Weight'\
  'Dislikes': 'dislikes'" 


async function chat() {
    rl.question("You: ", async (userInput) => {
        if (userInput.toLowerCase() == "exit" || "bye" || "quit"){
            console.log("Goodbye!");
            rl.close();
            return

        }
        
        try{
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemMessage},
                    { role: "user", content: userInput }
                ],
            });
            console.log("AI: ",response.choices[0].message.content);
        } catch (error){
            console.error("Error:", error);
        }
        
        chat();
    })
}