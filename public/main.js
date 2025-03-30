// public/main.js
document.addEventListener('DOMContentLoaded', async () => {
    let selectedMeal = null;
    let selectedRestaurant = null;
    
    // Fetch restaurants and populate selection
    try {
        const response = await fetch('/api/restaurants');
        const restaurants = await response.json();
        
        const restaurantSelect = document.createElement('select');
        restaurantSelect.id = 'restaurant-select';
        restaurantSelect.innerHTML = '<option value="">Select a restaurant</option>';
        
        restaurants.forEach(restaurant => {
            const option = document.createElement('option');
            option.value = restaurant;
            option.textContent = restaurant;
            restaurantSelect.appendChild(option);
        });
        
        restaurantSelect.addEventListener('change', (e) => {
            selectedRestaurant = e.target.value;
        });
        
        // Add the select to the page (adjust the selector as needed)
        document.querySelector('#restaurant-container').appendChild(restaurantSelect);
    } catch (error) {
        console.error('Error loading restaurants:', error);
    }
    
    // Meal selection logic
    document.querySelectorAll('.meal-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.meal-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedMeal = card.dataset.meal;
        });
    });

    // Recommendation handler
    document.getElementById('recommend-btn').addEventListener('click', async () => {
        if (!selectedMeal) {
            alert('Please select a meal type first!');
            return;
        }
        
        if (!selectedRestaurant) {
            alert('Please select a restaurant first!');
            return;
        }

        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    mealType: selectedMeal,
                    restaurantName: selectedRestaurant
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get recommendations');
            }

            const data = await response.json();
            
            // Display recommendations in a more structured way
            const resultsElement = document.getElementById('results');
            resultsElement.innerHTML = '';
            
            if (data.recommendations && data.recommendations.meals) {
                const meals = data.recommendations.meals;
                
                meals.forEach((meal, index) => {
                    const mealDiv = document.createElement('div');
                    mealDiv.className = 'meal-recommendation';
                    
                    mealDiv.innerHTML = `
                        <h3>${meal.name}</h3>
                        <p>${meal.description}</p>
                        <h4>Items:</h4>
                        <ul>
                            ${meal.items.map((item, i) => 
                                `<li>${item} (${meal.itemsservingsize[i]})</li>`
                            ).join('')}
                        </ul>
                        <div class="macros">
                            <p>Calories: ${meal.macros.calories}</p>
                            <p>Protein: ${meal.macros.protein}g</p>
                            <p>Carbs: ${meal.macros.carbs}g</p>
                            <p>Fat: ${meal.macros.fat}g</p>
                        </div>
                    `;
                    
                    resultsElement.appendChild(mealDiv);
                });
            } else {
                resultsElement.textContent = 'No recommendations found';
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to fetch recommendations');
        }
    });
});