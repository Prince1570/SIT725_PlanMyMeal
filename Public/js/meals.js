window.onload = () => {
  fetch("http://localhost:3000/api/meals")
    .then((res) => res.json())
    .then((meals) => {
      const container = document.getElementById("recipes-grid");
      container.innerHTML = meals?.data
        .map(
          (meal) => `
          <article class="recipe-card">
            <div class="avatar"></div>
            <h4>${meal.name}</h4>
            <p class="rc-desc">${meal.description}</p>
            <div class="meta"><span class="dot">●</span> <span class="cal">${
              meal.calories
            } calories</span></div>
            <p class="ingredients"><strong>Ingredients:</strong> ${meal.ingredients.join(
              ", "
            )}</p>
            <button class="btn favorite-btn" 
                    onclick="addToFavorites('${meal._id}')">
              ❤️ Add to Favorites
            </button>
          </article>
        `
        )
        .join("");
    })
    .catch((err) => console.error("Error loading meals:", err));
};

async function addToFavorites(mealId) {
  // alert(`Added "${name}" to favorites`);
  // Optional: POST to /api/favorites
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
