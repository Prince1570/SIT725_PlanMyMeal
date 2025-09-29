document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  // if (!isLoggedIn) {

  //     document.getElementById('loginModal').style.display = 'flex';
  // }

  const moodSelect = document.getElementById("mood");
  const suggestBtn = document.getElementById("suggestBtn");
  const skipBtn = document.getElementById("skipBtn");
  const suggestModal = document.getElementById("suggestModal");
  const suggestList = document.getElementById("suggestList");

  // MEALS LIST
  const meals = [
    "Grilled Salmon",
    "Chicken Caesar Salad",
    "Vegetable Stir Fry",
    "Beef Tacos",
    "Margherita Pizza",
    "Thai Green Curry",
    "BBQ Pulled Pork",
    "Veggie Delight",
    "Fruit Smoothie",
    "Spaghetti Bolognese",
  ];

  const moodMap = {
    energetic: ["Grilled Salmon", "Beef Tacos", "Fruit Smoothie"],
    relaxed: ["Vegetable Stir Fry", "Veggie Delight", "Thai Green Curry"],
    hungry: ["Margherita Pizza", "BBQ Pulled Pork", "Spaghetti Bolognese"],
    stressed: ["Chocolate Brownies (treat yourself!)", "Fruit Smoothie"],
    happy: ["Chicken Caesar Salad", "Grilled Salmon", "Margherita Pizza"],
  };

  // SUGGEST BUTTON
  suggestBtn.addEventListener("click", () => {
    const mood = moodSelect.value.toLowerCase().trim();

    if (mood === "") {
      suggestList.innerHTML = "<p>Please select a mood first.</p>";
      suggestModal.style.display = "flex";
      return;
    }
    const filteredMeals = moodMap[mood] || meals;

    const suggestionHTML = filteredMeals
      .map((meal) => `<p>${meal}</p>`)
      .join("");
    suggestList.innerHTML = suggestionHTML;
    suggestModal.style.display = "flex";
  });

  skipBtn.addEventListener("click", () => {
    suggestList.innerHTML =
      "<p>Enjoy our meal options! Feel free to browse the categories and recipes below.</p>";
    suggestModal.style.display = "flex";
  });

  document.querySelectorAll("#suggestModal .modal-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      suggestModal.style.display = "none";
    });
  });
});
