window.onload = () => {
  loadAllMeals();
  setupMoodSuggestions();

  // Hide featured section initially
  hideRecommendationsSection();
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

// Display recommendations in the featured section
function displayRecommendations(recommendations) {
  const featuredContainer = document.querySelector(".featured-cards");
  const recommendedTitle = document.getElementById("recommendedTitle");
  const featuredSection = document.querySelector(".featured");

  if (!featuredContainer) {
    console.error("Featured cards container not found");
    return;
  }

  if (recommendations && recommendations.length > 0) {
    // Show the section and title when we have recommendations
    if (featuredSection) {
      featuredSection.classList.remove("empty");
      featuredSection.style.display = "block";
    }

    if (recommendedTitle) {
      recommendedTitle.classList.remove("hidden");
    }

    featuredContainer.innerHTML = recommendations
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
  } else {
    // Hide the entire section when no recommendations
    if (featuredSection) {
      featuredSection.classList.add("empty");
      featuredSection.style.display = "none";
    }

    if (recommendedTitle) {
      recommendedTitle.classList.add("hidden");
    }

    featuredContainer.innerHTML = '';
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

  if (!token) {
    alert("Please log in to get personalized recommendations!");
    // Open login modal
    if (typeof openModal === 'function') {
      openModal("loginModal");
    }
    return;
  }

  try {
    // First, check if user profile exists
    const profileExists = await checkUserProfile();

    if (!profileExists) {
      // User profile doesn't exist, prompt to create one
      alert("Please complete your profile first to get personalized meal recommendations!");

      // Open profile setup modal
      if (typeof openModal === 'function') {
        openModal("profileSetupModal");
      }
      return; // Exit early, don't make recommendation call
    }

    // Profile exists, proceed with recommendations
    // Show loading state
    const featuredContainer = document.querySelector(".featured-cards");
    const recommendedTitle = document.getElementById("recommendedTitle");
    const featuredSection = document.querySelector(".featured");

    if (featuredContainer && recommendedTitle && featuredSection) {
      featuredSection.classList.remove("empty");
      featuredSection.style.display = "block";
      recommendedTitle.classList.remove("hidden");
      featuredContainer.innerHTML = '<div class="loading">Loading recommendations...</div>';
    }

    const response = await fetch(`http://localhost:3000/api/recommendations/${selectedMood}?noMockData=true`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Check if the response contains mock data warning
      if (data.warning && data.warning.includes("mock user")) {
        // Backend returned mock data, treat as no profile
        hideRecommendationsSection();
        alert("Please complete your profile first to get personalized meal recommendations!");

        if (typeof openModal === 'function') {
          openModal("profileSetupModal");
        }
        return;
      }

      displayRecommendations(data.items);

      // Scroll to recommendations section only if we have recommendations
      if (data.items && data.items.length > 0) {
        document.querySelector('.featured').scrollIntoView({
          behavior: 'smooth'
        });
      }
    } else {
      console.error("Error fetching recommendations:", data);

      // Check if error is related to missing profile
      if (data.error && (
        data.error.includes("profile not found") ||
        data.error.includes("User profile not found") ||
        data.error.includes("No user profile found")
      )) {
        hideRecommendationsSection();
        alert("Please complete your profile first to get personalized meal recommendations!");

        if (typeof openModal === 'function') {
          openModal("profileSetupModal");
        }
        return;
      }

      // Hide the entire section if there's an error
      hideRecommendationsSection();
      alert(data.error || "Failed to get recommendations");
    }
  } catch (error) {
    console.error("Error:", error);

    // Hide the entire section if there's an error
    hideRecommendationsSection();

    alert("Something went wrong while fetching recommendations");
  }
}

// Check if user profile exists
async function checkUserProfile() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return false;
  }

  try {
    const response = await fetch("http://localhost:3000/api/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Check if the response contains actual user profile or mock data
      if (data.profile && data.profile.userId && typeof data.profile.userId === 'object') {
        // Real profile exists
        return true;
      } else {
        // Mock data or incomplete profile
        return false;
      }
    } else {
      const data = await response.json();
      if (data.error === "User profile not found" ||
        data.error.includes("profile not found") ||
        data.error.includes("No user profile found")) {
        // Profile doesn't exist
        return false;
      } else {
        // Other error, assume profile exists to avoid blocking user
        console.error("Error checking profile:", data);
        return true;
      }
    }
  } catch (error) {
    console.error("Error checking profile:", error);
    // On network error, assume profile exists to avoid blocking user
    return true;
  }
}

// Helper function to hide recommendations section
function hideRecommendationsSection() {
  const recommendedTitle = document.getElementById("recommendedTitle");
  const featuredContainer = document.querySelector(".featured-cards");
  const featuredSection = document.querySelector(".featured");

  if (featuredSection) {
    featuredSection.classList.add("empty");
    featuredSection.style.display = "none";
  }

  if (recommendedTitle) {
    recommendedTitle.classList.add("hidden");
  }

  if (featuredContainer) {
    featuredContainer.innerHTML = '';
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
