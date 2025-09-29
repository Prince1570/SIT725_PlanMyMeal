const loginBtn = document.getElementById("loginBtn");
const userProfileBtn = document.getElementById("userProfileBtn");
const profileNameSpan = document.querySelector("#userProfileBtn .profile-name");

const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const profileModal = document.getElementById("profileModal");
const profileSetupModal = document.getElementById("profileSetupModal");
const profileNameElement = document.getElementById("profileName");
const profileEmailElement = document.getElementById("profileEmail");

const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const signupNameInput = document.getElementById("signupName");
const signupEmailInput = document.getElementById("signupEmail");
const signupPasswordInput = document.getElementById("signupPassword");

function displayMessage(modalElement, message, isError = false) {
  let messageArea = modalElement.querySelector(".modal-message-area");
  if (!messageArea) {
    messageArea = document.createElement("div");
    messageArea.classList.add("modal-message-area");
    modalElement.querySelector(".modal-panel").prepend(messageArea);
  }

  // Set styling and content
  messageArea.textContent = message;
  messageArea.style.padding = "10px";
  messageArea.style.borderRadius = "6px";
  messageArea.style.marginBottom = "10px";
  messageArea.style.textAlign = "center";
  messageArea.style.fontSize = "14px";

  if (isError) {
    messageArea.style.backgroundColor = "#fddede";
    messageArea.style.color = "#c0392b";
  } else {
    messageArea.style.backgroundColor = "#d1f5e6";
    messageArea.style.color = "#2f4f50";
  }

  // Clear message after 3 seconds
  setTimeout(() => {
    messageArea.textContent = "";
    messageArea.style.padding = "0";
    messageArea.style.backgroundColor = "transparent";
  }, 3000);
}

function openModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    modalElement.style.display = "flex";
    // Clear any previous messages on open
    const messageArea = modalElement.querySelector(".modal-message-area");
    if (messageArea) {
      messageArea.textContent = "";
    }
  }
}

function closeModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    modalElement.style.display = "none";
  }
}

// Function to manage which buttons are visible in the header
function updateHeaderUI(user) {
  const loginBtn = document.getElementById("loginBtn");
  const userProfileBtn = document.getElementById("userProfileBtn");
  const profileNameSpan = document.querySelector(
    "#userProfileBtn .profile-name"
  );

  if (user) {
    // User is logged in: Hide Login, Show User Profile
    loginBtn.classList.add("hidden");
    userProfileBtn.classList.remove("hidden");

    // Display user's first name on the button
    const firstName = user.name
      ? user.name.split(" ")[0]
      : user.username || "User";
    profileNameSpan.textContent = firstName;
  } else {
    // User is logged out: Show Login, Hide User Profile
    loginBtn.classList.remove("hidden");
    userProfileBtn.classList.add("hidden");
  }
}

function switchToSignup() {
  closeModal("loginModal");
  openModal("signupModal");
}

function switchToLogin() {
  closeModal("signupModal");
  openModal("loginModal");
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (email && password) {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store both token and user data
        localStorage.setItem("authToken", data.user.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        // Update UI immediately after successful login
        updateHeaderUI(data.user);
        closeModal("loginModal");

        // Clear form fields
        document.getElementById("loginEmail").value = "";
        document.getElementById("loginPassword").value = "";

        console.log("Login successful!", data.user);
      } else {
        displayMessage(loginModal, data.message || "Login failed", true);
      }
    } catch (error) {
      console.error("Error:", error);
      displayMessage(
        loginModal,
        "Something went wrong. Please try again.",
        true
      );
    }
  } else {
    displayMessage(loginModal, "Please enter email and password", true);
  }
}

async function signupUser() {
  const username = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (username && email && password) {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store both token and user data
        localStorage.setItem("authToken", data.user.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        // Update UI immediately after successful signup
        updateHeaderUI(data.user);
        closeModal("signupModal");

        // Clear form fields
        document.getElementById("signupName").value = "";
        document.getElementById("signupEmail").value = "";
        document.getElementById("signupPassword").value = "";

        console.log("Registration successful!", data.user);
      } else {
        displayMessage(
          signupModal,
          data.message || "Registration failed",
          true
        );
      }
    } catch (error) {
      console.error("Error:", error);
      displayMessage(
        signupModal,
        "Something went wrong. Please try again.",
        true
      );
    }
  } else {
    displayMessage(signupModal, "Please fill all fields", true);
  }
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("authToken");
  console.log("User logged out."); // Use console log for system actions

  if (profileModal.style.display === "flex") {
    closeModal("profileModal");
  }

  // Update UI to show login button again
  updateHeaderUI(null);
}

async function fetchUserProfile() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("No auth token found");
    return null;
  }

  try {
    const response = await fetch("http://localhost:3000/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data.profile;
    } else if (data.error === "User profile not found") {
      // Profile doesn't exist, need to create one
      return null;
    } else {
      console.error("Error fetching profile:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

async function createUserProfile() {
  const token = localStorage.getItem("authToken");
  const dietaryType = document.getElementById("dietaryType").value;

  // Get selected allergies from checkboxes
  const allergyCheckboxes = document.querySelectorAll(
    'input[type="checkbox"][id^="allergy-"]:checked'
  );
  const allergies = Array.from(allergyCheckboxes)
    .map((checkbox) => checkbox.value)
    .filter((value) => value !== "none");

  const calorieTarget = parseInt(
    document.getElementById("calorieTarget").value
  );

  if (!dietaryType || !calorieTarget) {
    displayMessage(
      profileSetupModal,
      "Please fill in all required fields",
      true
    );
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dietaryType,
        allergies,
        calorieTarget,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      displayMessage(profileSetupModal, "Profile created successfully!", false);

      // Close setup modal and show profile
      setTimeout(() => {
        closeModal("profileSetupModal");
        displayUserProfile();
      }, 1500);
    } else {
      displayMessage(
        profileSetupModal,
        data.message || "Failed to create profile",
        true
      );
    }
  } catch (error) {
    console.error("Error creating profile:", error);
    displayMessage(
      profileSetupModal,
      "Something went wrong. Please try again.",
      true
    );
  }
}

function displayProfileData(profile) {
  // Display user basic info
  const user = profile.userId;
  document.getElementById("profileName").textContent = user.username || "N/A";
  document.getElementById("profileEmail").textContent = user.email || "N/A";
  document.getElementById("profileGender").textContent = user.gender || "N/A";

  // Format date of birth
  if (user.dateOfBirth) {
    const dob = new Date(user.dateOfBirth).toLocaleDateString();
    document.getElementById("profileDOB").textContent = dob;
  } else {
    document.getElementById("profileDOB").textContent = "N/A";
  }

  // Display profile specific info
  document.getElementById("profileDietaryType").textContent =
    profile.dietaryType || "N/A";
  document.getElementById("profileAllergies").textContent =
    profile.allergies && profile.allergies.length > 0
      ? profile.allergies.join(", ")
      : "None";
  document.getElementById("profileCalorieTarget").textContent =
    profile.calorieTarget ? `${profile.calorieTarget} calories` : "N/A";
}

async function displayUserProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    console.error("User data not found. Redirecting to login.");
    logoutUser();
    openModal("loginModal");
    return;
  }

  // Show loading state
  const profileContent = document.getElementById("profileContent");
  profileContent.innerHTML = '<div class="loading">Loading profile...</div>';
  openModal("profileModal");

  // Fetch profile data
  const profile = await fetchUserProfile();

  if (profile) {
    // Profile exists, display it
    profileContent.innerHTML = `
      <div class="profile-info">
        <p><strong>Name:</strong> <span id="profileName"></span></p>
        <p><strong>Email:</strong> <span id="profileEmail"></span></p>
        <p><strong>Gender:</strong> <span id="profileGender"></span></p>
        <p><strong>Date of Birth:</strong> <span id="profileDOB"></span></p>
        <p><strong>Dietary Type:</strong> <span id="profileDietaryType"></span></p>
        <p><strong>Allergies:</strong> <span id="profileAllergies"></span></p>
        <p><strong>Calorie Target (Per Meal):</strong> <span id="profileCalorieTarget"></span></p>
      </div>
    `;
    displayProfileData(profile);
  } else {
    // Profile doesn't exist, close profile modal and open setup modal
    closeModal("profileModal");
    openModal("profileSetupModal");
  }
}

function editProfile() {
  // Close profile modal and open setup modal for editing
  closeModal("profileModal");

  // Pre-fill the form with existing data if available
  fetchUserProfile().then((profile) => {
    if (profile) {
      document.getElementById("dietaryType").value = profile.dietaryType || "";
      document.getElementById("calorieTarget").value =
        profile.calorieTarget || "";

      // Clear all checkboxes first
      document
        .querySelectorAll('input[type="checkbox"][id^="allergy-"]')
        .forEach((checkbox) => {
          checkbox.checked = false;
        });

      // Check the appropriate allergy checkboxes
      if (profile.allergies && profile.allergies.length > 0) {
        profile.allergies.forEach((allergy) => {
          const checkbox = document.getElementById(`allergy-${allergy}`);
          if (checkbox) {
            checkbox.checked = true;
          }
        });
      } else {
        // If no allergies, check the "No allergies" option
        const noneCheckbox = document.getElementById("allergy-none");
        if (noneCheckbox) {
          noneCheckbox.checked = true;
        }
      }
    }
    openModal("profileSetupModal");
  });
}

// Add functionality to handle "No allergies" checkbox
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in when page loads
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  updateHeaderUI(currentUser);

  // Rest of your event listeners...
  const loginBtn = document.getElementById("loginBtn");
  const userProfileBtn = document.getElementById("userProfileBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => openModal("loginModal"));
  }

  if (userProfileBtn) {
    userProfileBtn.addEventListener("click", displayUserProfile);
  }

  document.querySelectorAll(".modal-close").forEach((button) => {
    button.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal");
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  window.addEventListener("click", (event) => {
    if (event.target === loginModal) closeModal("loginModal");
    if (event.target === signupModal) closeModal("signupModal");
    if (event.target === profileModal) closeModal("profileModal");
  });
  window.loginUser = loginUser;
  window.signupUser = signupUser;
  window.logoutUser = logoutUser;
  window.switchToLogin = switchToLogin;
  window.switchToSignup = switchToSignup;
  window.closeModal = closeModal;

  // Add new global functions
  window.createUserProfile = createUserProfile;
  window.editProfile = editProfile;

  // Handle "No allergies" checkbox logic
  const noneCheckbox = document.getElementById("allergy-none");
  const allergyCheckboxes = document.querySelectorAll(
    'input[type="checkbox"][id^="allergy-"]:not(#allergy-none)'
  );

  if (noneCheckbox) {
    noneCheckbox.addEventListener("change", function () {
      if (this.checked) {
        // If "No allergies" is checked, uncheck all other allergy checkboxes
        allergyCheckboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
    });
  }

  // If any specific allergy is checked, uncheck "No allergies"
  allergyCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (this.checked && noneCheckbox) {
        noneCheckbox.checked = false;
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  updateHeaderUI(currentUser);
});

function handleAllergiesChange() {
  const allergySelect = document.getElementById("signupAllergies");
  const customInput = document.getElementById("customAllergiesInput");

  if (allergySelect.value === "other") {
    // If 'Other' is selected, show the text input and make it required
    customInput.classList.remove("hidden");
    customInput.setAttribute("required", "required");
  } else {
    customInput.classList.add("hidden");
    customInput.removeAttribute("required");
    customInput.value = "";
  }
}
