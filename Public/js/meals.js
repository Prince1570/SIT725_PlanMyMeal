window.onload = () => {
  loadAllMeals();
  setupMoodSuggestions();
};

// Load all meals on page load
function loadAllMeals() {
  fetch("http://localhost:3000/api/meals")
    .then((res) => res.json())
    .then((meals) => {
      const container = document.getElementById("recipes-grid");
      if (container) {
        container.innerHTML = meals?.data
          .map(
            (meal) => `
            <article class="recipe-card" onclick="showMealDetails('${meal._id}', '${meal.name}', '${meal.description}', '${meal.calories}', '${meal.ingredients.join(", ")}')">
              <div class="avatar"></div>
              <h4>${meal.name}</h4>
              <p class="rc-desc">${meal.description}</p>
              <div class="meta"><span class="dot">●</span> <span class="cal">${meal.calories
              } calories</span></div>
              <p class="ingredients"><strong>Ingredients:</strong> ${meal.ingredients.join(
                ", "
              )}</p>
              <button class="btn favorite-btn" 
                      onclick="event.stopPropagation(); addToFavorites('${meal._id}')">
                ❤️ Add to Favorites
              </button>
            </article>
          `
          )
          .join("");
      }
    })
    .catch((err) => console.error("Error loading meals:", err));
}

// Setup mood-based suggestions
function setupMoodSuggestions() {
  const suggestBtn = document.getElementById("suggestBtn");
  if (suggestBtn) {
    suggestBtn.addEventListener("click", getMoodBasedRecommendations);
  }
}

// Get mood-based recommendations
async function getMoodBasedRecommendations() {
  const moodSelect = document.getElementById("mood");
  const selectedMood = moodSelect.value;

  if (!selectedMood) {
    alert("Please select your mood first!");
    return;
  }

  const token = localStorage.getItem("authToken");

  try {
    // Show loading state
    const featuredContainer = document.querySelector(".featured-cards");
    if (featuredContainer) {
      featuredContainer.innerHTML = '<div class="loading">Loading recommendations...</div>';
    }

    const response = await fetch(`http://localhost:3000/api/recommendations/${selectedMood}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      displayRecommendations(data.items);

      // Scroll to recommendations section
      document.querySelector('.featured').scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      console.error("Error fetching recommendations:", data);
      alert(data.error || "Failed to get recommendations");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong while fetching recommendations");
  }
}

// Display recommendations in the featured section
function displayRecommendations(recommendations) {
  const featuredContainer = document.querySelector(".featured-cards");

  if (!featuredContainer) {
    // Create the featured-cards container if it doesn't exist
    const featuredInner = document.querySelector(".featured-inner");
    if (featuredInner) {
      featuredInner.innerHTML += '<div class="featured-cards"></div>';
    }
  }

  const container = document.querySelector(".featured-cards");

  if (container && recommendations && recommendations.length > 0) {
    container.innerHTML = recommendations
      .map(
        (meal) => `
        <article class="recommendation-card" onclick="showRecommendationDetails('${meal.meal_id}', '${meal.title}', '${meal.ingredients.join(", ")}', '${meal.nutrition.kcal}', '${meal.reasons.join(", ")}', '${meal.confidence}')">
          <div class="rec-header">
            <h4>${meal.title}</h4>
            <span class="confidence">Confidence: ${(meal.confidence * 100).toFixed(0)}%</span>
          </div>
          <div class="nutrition-info">
            <span class="calories">${meal.nutrition.kcal} kcal</span>
            <span class="protein">${meal.nutrition.protein_g}g protein</span>
            <span class="carbs">${meal.nutrition.carbs_g}g carbs</span>
            <span class="fat">${meal.nutrition.fat_g}g fat</span>
          </div>
          <p class="ingredients"><strong>Ingredients:</strong> ${meal.ingredients.join(", ")}</p>
          <div class="reasons">
            <strong>Why this matches:</strong> ${meal.reasons.map(reason => `<span class="reason-tag">${reason}</span>`).join("")}
          </div>
          <button class="btn primary view-details" onclick="event.stopPropagation(); showRecommendationDetails('${meal.meal_id}', '${meal.title}', '${meal.ingredients.join(", ")}', '${meal.nutrition.kcal}', '${meal.reasons.join(", ")}', '${meal.confidence}')">
            View Details
          </button>
        </article>
      `
      )
      .join("");
  } else if (container) {
    container.innerHTML = '<p>No recommendations found for your selected mood. Try a different mood!</p>';
  }
}

// Show recommendation details in a modal
function showRecommendationDetails(mealId, title, ingredients, calories, reasons, confidence) {
  const modal = document.createElement('div');
  modal.className = 'meal-detail-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
      <h3>${title}</h3>
      <div class="meal-details">
        <p><strong>Meal ID:</strong> ${mealId}</p>
        <p><strong>Calories:</strong> ${calories} kcal</p>
        <p><strong>Ingredients:</strong> ${ingredients}</p>
        <p><strong>Why this matches your mood:</strong> ${reasons}</p>
        <p><strong>Confidence Score:</strong> ${(confidence * 100).toFixed(0)}%</p>
      </div>
      <button class="btn primary" onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
  `;

  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  document.body.appendChild(modal);
}

// Show meal details for regular meals
function showMealDetails(mealId, name, description, calories, ingredients) {
  const modal = document.createElement('div');
  modal.className = 'meal-detail-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
      <h3>${name}</h3>
      <div class="meal-details">
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Calories:</strong> ${calories} calories</p>
        <p><strong>Ingredients:</strong> ${ingredients}</p>
      </div>
      <div class="modal-actions">
        <button class="btn favorite-btn" onclick="addToFavorites('${mealId}')">❤️ Add to Favorites</button>
        <button class="btn primary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
      </div>
    </div>
  `;

  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  document.body.appendChild(modal);
}

async function addToFavorites(mealId) {
  try {
    const response = await fetch("http://localhost:3000/api/favourites/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ mealId }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data?.message);
    } else {
      alert(data.error || "Failed to proceed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
}
