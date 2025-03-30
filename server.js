const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/restaurants', (req, res) => {
  try {
    const restaurants = fs.readdirSync(path.join(__dirname, 'restaurants'))
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load restaurants' });
  }
});

app.post('/api/recommendations', async (req, res) => {
  try {
    const { restaurantName, mealType } = req.body;
    const preferences = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'user_preferences/user123.json'), 'utf8')
    );

    const restaurantPath = path.join(__dirname, 'restaurants', `${restaurantName}.json`);
    if (!fs.existsSync(restaurantPath)) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const menuItems = JSON.parse(fs.readFileSync(restaurantPath, 'utf8'));
    
    // Format menu items for the prompt
    const menuDescription = menuItems.map(item => {
      // Clean up nutrition data
      const nutrition = Object.entries(item.nutrition)
        .map(([key, value]) => {
          // Remove underscores and format key properly
          const cleanKey = key.replace(/_/g, ' ').replace(/\(|\)/g, '');
          return `${cleanKey}: ${value}`;
        })
        .join(', ');
      
      // Get ingredients, filtering out duplicated nutrition info
      const cleanIngredients = item.ingredients
        .filter((ing, index) => {
          // Skip the first ingredient if it contains duplicated nutrition info
          if (index === 0 && ing.includes('\n\u00d7\n')) {
            return false;
          }
          return true;
        })
        .join(', ');
      
      // Return formatted menu item description with portion
      return `- ${item.name}\n  ${nutrition}\n  Portion: ${item.portion}\n  Ingredients: ${cleanIngredients || 'None'}`;
    }).join('\n');

    const prompt = `Recommend 3 meal options from ${restaurantName} for ${mealType} considering:
- Dietary restrictions: ${preferences["Dietary restrictions"].join(', ')}
- Dislikes: ${preferences.Dislikes.join(', ')}

Available meals/ingredients:
${menuDescription}
If the restaurant has many a la cart options or sides, consider those and build a well rounded meal.
If the restaurant is pierce do not have the user assemble too much of their meal. Rather combine multiple substantial sources.Exeptions for things like burgers or sandwhiches were ingredents are only
The meals should each be pretty different offering a very healthy, medium healthy, and comfort/cheat meal but don't label them.
If you you have a better name for any of the food items you can update the anem of the food item.
Prioritize:
1. Matching dietary needs
2. Avoiding disliked ingredients
3. Meal type appropriateness

Return ONLY a JSON object with this structure:
{
  "meals": [
    {
      "name": "Meal Option 1",
      "description": "Description of the meal",
      "items": ["Item 1", "Item 2"],
      "itemsservingsize": ["Item 1: Serving Size", "Item 2: Serving Size"],
      "macros": {
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0
      }
    },
    // repeat for all 3 meal options
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    let recommendationsData;
    try {
      recommendationsData = JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      recommendationsData = { 
        error: "Failed to parse recommendations",
        rawContent: response.choices[0].message.content
      };
    }

    res.json({
      restaurant: restaurantName,
      recommendations: recommendationsData
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));