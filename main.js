const searchBtn = document.getElementById('searchBtn');
const ingredientInput = document.getElementById('ingredientInput');
const result = document.getElementById('result');
const loadingSpinner = document.getElementById('loadingSpinner');
const recipePopup = document.getElementById('recipePopup');
const recipeTitle = document.getElementById('recipeTitle');
const recipeDetails = document.getElementById('recipeDetails');
const closePopup = document.getElementById('closePopup');

ingredientInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

searchBtn.addEventListener("click", async () => {
    const query = ingredientInput.value.trim();

    // Validate input
    if (!query) {
        ingredientInput.classList.add("error");
        setTimeout(() => {
            ingredientInput.classList.remove("error");
        }, 1000);
        return;
    }

    // Show loading spinner
    loadingSpinner.classList.remove("hidden");

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Hide loading spinner
        loadingSpinner.classList.add("hidden");

        // Clear previous results
        result.innerHTML = "";

        // Handle no results
        if (!data.meals) {
            result.innerHTML = `<p>No recipes found for "${query}".</p>`;
            return;
        }

        // Display recipes
        data.meals.forEach(meal => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <button class="get-recipe" data-id="${meal.idMeal}">Get Recipe</button>
            `;

            // Add event listener for the recipe button
            card.querySelector(".get-recipe").addEventListener("click", async () => {
                const mealId = meal.idMeal;
                const recipeApi = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
                const recipeResponse = await fetch(recipeApi);
                const recipeData = await recipeResponse.json();

                const mealDetails = recipeData.meals[0];
                recipeTitle.textContent = mealDetails.strMeal;

                const instructions = mealDetails.strInstructions
                    .split("\n")
                    .filter(line => line.trim() !== "")
                    .map(line => `<p>${line}</p>`)
                    .join("");

                recipeDetails.innerHTML = instructions;
                recipePopup.classList.remove("hidden");
            });

            result.appendChild(card);
        });

        ingredientInput.value = "";
        
    } catch (error) {
        console.error("Error fetching recipes:", error);
        loadingSpinner.classList.add("hidden");
        result.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
});

closePopup.addEventListener("click", () => {
    recipePopup.classList.add("hidden");
});

recipePopup.addEventListener("click", (e) => {
    if (e.target === recipePopup) {
        recipePopup.classList.add("hidden");
    }
});
