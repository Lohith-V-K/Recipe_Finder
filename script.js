const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const mealsGrid = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const loader = document.getElementById('loader');
const modal = document.getElementById('recipe-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-btn');

// Base API URL
const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// Event Listeners
searchBtn.addEventListener('click', searchMeal);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMeal();
});
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Search Meal Function
async function searchMeal() {
    const term = searchInput.value.trim();

    if (term) {
        // Clear previous results
        mealsGrid.innerHTML = '';
        resultHeading.innerHTML = '';

        // Hide Featured Section
        const featuredSection = document.getElementById('featured-section');
        if (featuredSection) {
            featuredSection.classList.add('hidden');
        }

        // Show Loader
        loader.classList.remove('hidden');

        try {
            const response = await fetch(`${API_URL}${term}`);
            const data = await response.json();

            // Hide Loader
            loader.classList.add('hidden');

            if (data.meals === null) {
                resultHeading.innerHTML = `<p>No search results found for '${term}'. Try another term!</p>`;
            } else {
                resultHeading.innerHTML = `Search results for '${term}':`;
                displayMeals(data.meals);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            loader.classList.add('hidden');
            resultHeading.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
        }
    } else {
        alert('Please enter a search term');
    }
}

// Display Meals in Grid
function displayMeals(meals) {
    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('meal-card');

        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-img">
            <div class="meal-info">
                <h3>${meal.strMeal}</h3>
                <span>${meal.strArea} ${meal.strCategory}</span>
            </div>
        `;

        // Add Click Event to Open Modal
        mealCard.addEventListener('click', () => {
            openModal(meal);
        });

        mealsGrid.appendChild(mealCard);
    });
}

// Open Modal with Recipe Details
function openModal(meal) {
    const ingredients = [];

    // Get ingredients and measures (up to 20)
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }

    modalBody.innerHTML = `
        <div class="recipe-details">
            <div class="recipe-header">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h2>${meal.strMeal}</h2>
                <div class="recipe-category">${meal.strArea} • ${meal.strCategory}</div>
            </div>
            
            <div class="recipe-ingredients">
                <h3>Ingredients:</h3>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>

            <div class="recipe-instruct">
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>

            ${meal.strYoutube ? `
            <div class="recipe-link">
                <a href="${meal.strYoutube}" target="_blank">
                    <i class="fab fa-youtube"></i> Watch Video Tutorial
                </a>
            </div>` : ''}
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Modal Function
function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restore scrolling
}
