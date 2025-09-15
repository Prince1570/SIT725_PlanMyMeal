document.addEventListener('DOMContentLoaded', () => {
    // LOGIN CHECK
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        document.getElementById('loginModal').style.display = 'flex';
    }

    // MOOD INPUT ELEMENTS
    const moodInput = document.getElementById('mood');
    const suggestBtn = document.getElementById('suggestBtn');
    const skipBtn = document.getElementById('skipBtn');
    const suggestModal = document.getElementById('suggestModal');
    const suggestList = document.getElementById('suggestList');

    // MEALS LIST
    const meals = [
        "Grilled Salmon",
        "Chicken Caesar Salad",
        "Vegetable Stir Fry",
        "Beef Tacos",
        "Margherita Pizza",
        "Thai Green Curry",
        "BBQ Pulled Pork",
        "Veggie Delight"
    ];

    // MOOD TO MEALS MAPPING
    const moodMap = {
        energetic: ["Grilled Salmon", "Beef Tacos"],
        relaxed: ["Vegetable Stir Fry", "Veggie Delight"],
        hungry: ["Margherita Pizza", "BBQ Pulled Pork"]
    };

    // SUGGEST BUTTON
    suggestBtn.addEventListener('click', () => {
        const mood = moodInput.value.toLowerCase().trim();
        const filteredMeals = moodMap[mood] || meals; // if mood not found, show all meals

        suggestList.innerHTML = filteredMeals.map(meal => `<p>${meal}</p>`).join('');
        suggestModal.style.display = 'flex';
    });

    // SKIP BUTTON
skipBtn.addEventListener('click', () => {
    suggestList.innerHTML = "<p>Enjoy our meal options!</p>";
    suggestModal.style.display = 'flex';
});

    // CLOSE MODAL
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            suggestModal.style.display = 'none';
        });
    });
});
