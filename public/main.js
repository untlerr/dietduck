// public/main.js
document.addEventListener('DOMContentLoaded', () => {
    let selectedMeal = null;
    
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

        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mealType: selectedMeal })
            });

            const data = await response.json();
            document.getElementById('results').innerHTML = marked.parse(data.recommendations);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to fetch recommendations');
        }
    });
});