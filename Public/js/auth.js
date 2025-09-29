function openModal(modalId) {
  document.getElementById(modalId).style.display = "flex";
}
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
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
        localStorage.setItem("authToken", data.user.token);
        alert("Login successful!");
        closeModal("loginModal");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
    // alert(`Logged in as ${email}`);
    // closeModal("loginModal");
    // Here you can add actual login API call
  } else {
    alert("Please enter email and password");
  }
}

async function signupUser() {
  const username = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  if (username && email && password) {
    try {
      alert(`Signed up as ${username}`);
      closeModal("signupModal");
      // Here you can add actual signup API call

      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.user.token);
        alert("Register successful!");
      } else {
        alert(data.message || "Register failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  } else {
    alert("Please fill all fields");
  }
}

// Attach modal open events to header buttons
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".btn.ghost")
    .addEventListener("click", () => openModal("loginModal"));
});

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    document.getElementById("loginModal").style.display = "flex";
  }
});

// function loginUser() {
//   // after successful login
//   localStorage.setItem("isLoggedIn", "true");
//   document.getElementById("loginModal").style.display = "none";
// }

function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("authToken");
  document.getElementById("loginModal").style.display = "flex";
}
