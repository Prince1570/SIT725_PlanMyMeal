// Load meal history when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadMealHistory();
});

// Fetch meal history from API
async function loadMealHistory() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        // Hide meal history section if user is not logged in
        const historySection = document.querySelector('.categories');
        if (historySection) {
            historySection.style.display = 'none';
        }
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/recommendations/meal/history", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.ok) {
            displayMealHistory(data.data);
        } else {
            console.error("Error fetching meal history:", data);
            // Hide section if no history available
            const historySection = document.querySelector('.categories');
            if (historySection) {
                historySection.style.display = 'none';
            }
        }
    } catch (error) {
        console.error("Error:", error);
        // Hide section on error
        const historySection = document.querySelector('.categories');
        if (historySection) {
            historySection.style.display = 'none';
        }
    }
}

// Display meal history grouped by mood
function displayMealHistory(historyData) {
    const categoryRow = document.querySelector('.category-row');
    const historySection = document.querySelector('.categories');

    if (!categoryRow || !historyData || historyData.length === 0) {
        if (historySection) {
            historySection.style.display = 'none';
        }
        return;
    }

    // Show the section
    historySection.style.display = 'block';

    // Group meals by mood
    const moodGroups = groupMealsByMood(historyData);

    // Create mood pills
    categoryRow.innerHTML = Object.keys(moodGroups).map(mood => {
        const moodEmoji = getMoodEmoji(mood);
        const mealCount = moodGroups[mood].reduce((total, session) => total + session.items.length, 0);

        return `
      <button class="pill mood-pill" data-mood="${mood}" onclick="toggleMoodHistory('${mood}')">
        ${moodEmoji} ${capitalizeFirstLetter(mood)} (${mealCount})
      </button>
    `;
    }).join('');

    // Create expandable history sections for each mood
    const historyContainer = document.createElement('div');
    historyContainer.className = 'history-container';
    historyContainer.innerHTML = Object.keys(moodGroups).map(mood => {
        return `
      <div class="mood-history hidden" id="history-${mood}">
        <h3>${capitalizeFirstLetter(mood)} Meal History</h3>
        <div class="history-sessions">
          ${moodGroups[mood].map(session => `
            <div class="history-session">
              <div class="session-header">
                <span class="session-date">${formatDate(session.requestedAt)}</span>
                <span class="session-count">${session.items.length} meals</span>
              </div>
              <div class="session-meals">
                ${session.items.map(meal => `
                  <div class="history-meal-card" onclick="showHistoryMealDetails('${meal.meal_id}', '${meal.title}', '${meal.ingredients.join(", ")}', '${meal.nutrition.kcal}', '${meal.reasons.join(", ")}', '${meal.confidence}')">
                    <h4>${meal.title}</h4>
                    <div class="meal-meta">
                      <span class="calories">${meal.nutrition.kcal} kcal</span>
                      <span class="confidence">Confidence: ${(meal.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <p class="meal-ingredients">${meal.ingredients.slice(0, 3).join(", ")}${meal.ingredients.length > 3 ? '...' : ''}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    }).join('');

    // Insert history container after category-row
    categoryRow.parentNode.insertBefore(historyContainer, categoryRow.nextSibling);
}

// Group meals by mood
function groupMealsByMood(historyData) {
    const groups = {};

    historyData.forEach(session => {
        const mood = session.mood;
        if (!groups[mood]) {
            groups[mood] = [];
        }
        groups[mood].push(session);
    });

    return groups;
}

// Get emoji for mood
function getMoodEmoji(mood) {
    const moodEmojis = {
        'comforting': '🥘',
        'energetic': '⚡',
        'light': '🥗',
        'festive': '🎉',
        'quick-and-easy': '⚡'
    };
    return moodEmojis[mood] || '🍽️';
}

// Toggle mood history visibility
function toggleMoodHistory(mood) {
    const historyDiv = document.getElementById(`history-${mood}`);
    const allHistoryDivs = document.querySelectorAll('.mood-history');

    // Hide all other mood histories
    allHistoryDivs.forEach(div => {
        if (div.id !== `history-${mood}`) {
            div.classList.add('hidden');
        }
    });

    // Toggle the selected mood history
    if (historyDiv) {
        historyDiv.classList.toggle('hidden');
    }

    // Update pill styles
    const allPills = document.querySelectorAll('.mood-pill');
    const selectedPill = document.querySelector(`[data-mood="${mood}"]`);

    allPills.forEach(pill => pill.classList.remove('active'));

    if (!historyDiv.classList.contains('hidden')) {
        selectedPill.classList.add('active');
    }
}

// Show meal details from history
function showHistoryMealDetails(mealId, title, ingredients, calories, reasons, confidence) {
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
        <p><strong>Why this matched your mood:</strong> ${reasons}</p>
        <p><strong>Confidence Score:</strong> ${(confidence * 100).toFixed(0)}%</p>
      </div>
      <div class="modal-actions">
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

// Utility functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace('-', ' & ');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Add to favorites function (if not already defined)
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