const submit = document.getElementById('submit');
const search = document.getElementById('search');
const generate = document.getElementById('generate');
const resultsHeading = document.getElementById('results-heading');
const meals = document.getElementById('meals');
const selectedMeal = document.getElementById('selected-meal');

function searchMeal(e) {
    e.preventDefault();
    const searchText = search.value;
    // console.log(searchText);
    if (searchText.trim()) {
        // console.log(searchText);
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                resultsHeading.innerHTML = `<h2>Search results for ${searchText}</h2>`;
                if (data.meals === null) {
                    resultsHeading.innerHTML = `<h2>No results found for ${searchText}</h2>`;
                } else {
                    meals.innerHTML = data.meals.map( meal => ` 
                        <div class='meal'>
                            <img src='${meal.strMealThumb}' alt='${meal.strMeal}'/>
                            <div class='meal-info' data-mealID='${meal.idMeal}'>
                                <h3>${meal.strMeal}</h3>

                            </div>
                        </div> 
                    
                    `)
                    .join('');
                }
            });
            search.value = '';
    } else {
        alert('Please Enter Search Keyword')
    }
    selectedMeal.innerHTML = '';
}

function getMeal(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0]
            // console.log(meal);
            displayMealDetail(meal)
        });
}

function displayMealDetail(meal) {
    meals.innerHTML = '';
    resultsHeading.innerHTML = '';
    // console.log(meal);
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]}: ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    selectedMeal.innerHTML = `
        <div class='selected-meal-details'>
            <h1>${meal.strMeal}</h1>
            <img src='${meal.strMealThumb}' alt='${meal.strMeal}'/>
            <div class='selected-meal-info'>
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class='selected-meal-instructions'>
                <p>${meal.strInstructions}</p>
                <h3>Ingredients</h3>
                <ul>
                    ${ingredients.map( ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
        </div>
    `
}

function generateRandomMeal() {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0]
            // console.log(meal);
            displayMealDetail(meal)
        })
}

// Event Listeners
submit.addEventListener('submit', searchMeal);

meals.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false
        }
    })
    if (mealInfo) {
        const mealId = mealInfo.getAttribute('data-mealid');
        // console.log(mealId);
        getMeal(mealId);
    }
});

generate.addEventListener('click', generateRandomMeal);