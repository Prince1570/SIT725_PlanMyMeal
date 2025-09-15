function openModal(modalId) {
  document.getElementById(modalId).style.display = "flex";
}
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}


function switchToSignup() {
  closeModal('loginModal');
  openModal('signupModal');
}

function switchToLogin() {
  closeModal('signupModal');
  openModal('loginModal');
}


function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if(email && password){
    alert(`Logged in as ${email}`);
    closeModal('loginModal');
    // Here you can add actual login API call
  } else {
    alert('Please enter email and password');
  }
}

function signupUser() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  if(name && email && password){
    alert(`Signed up as ${name}`);
    closeModal('signupModal');
    // Here you can add actual signup API call
  } else {
    alert('Please fill all fields');
  }
}

// Attach modal open events to header buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.btn.ghost').addEventListener('click', () => openModal('loginModal'));
});


document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        document.getElementById('loginModal').style.display = 'flex';
    }
});

function loginUser() {
    // after successful login
    localStorage.setItem('isLoggedIn', 'true');
    document.getElementById('loginModal').style.display = 'none';
}

function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    document.getElementById('loginModal').style.display = 'flex'; 
}
