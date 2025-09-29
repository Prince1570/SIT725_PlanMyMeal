const loginBtn = document.getElementById('loginBtn');
const userProfileBtn = document.getElementById('userProfileBtn');
const profileNameSpan = document.querySelector('#userProfileBtn .profile-name');

const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const profileModal = document.getElementById('profileModal');
const profileNameElement = document.getElementById('profileName');
const profileEmailElement = document.getElementById('profileEmail');

const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const signupNameInput = document.getElementById('signupName');
const signupEmailInput = document.getElementById('signupEmail');
const signupPasswordInput = document.getElementById('signupPassword');

function displayMessage(modalElement, message, isError = false) {
    let messageArea = modalElement.querySelector('.modal-message-area');
    if (!messageArea) {
        messageArea = document.createElement('div');
        messageArea.classList.add('modal-message-area');
        modalElement.querySelector('.modal-panel').prepend(messageArea);
    }

    // Set styling and content
    messageArea.textContent = message;
    messageArea.style.padding = '10px';
    messageArea.style.borderRadius = '6px';
    messageArea.style.marginBottom = '10px';
    messageArea.style.textAlign = 'center';
    messageArea.style.fontSize = '14px';

    if (isError) {
        messageArea.style.backgroundColor = '#fddede';
        messageArea.style.color = '#c0392b';
    } else {
        messageArea.style.backgroundColor = '#d1f5e6';
        messageArea.style.color = '#2f4f50';
    }
    
    // Clear message after 3 seconds
    setTimeout(() => {
        messageArea.textContent = '';
        messageArea.style.padding = '0';
        messageArea.style.backgroundColor = 'transparent';
    }, 3000);
}


function openModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        modalElement.style.display = 'flex';
        // Clear any previous messages on open
        const messageArea = modalElement.querySelector('.modal-message-area');
        if (messageArea) {
            messageArea.textContent = '';
        }
    }
}

function closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        modalElement.style.display = 'none';
    }
}

// Function to manage which buttons are visible in the header
function updateHeaderUI(user) {
    if (user) {
        // User is logged in: Hide Login, Show User Profile
        loginBtn.classList.add('hidden');
        userProfileBtn.classList.remove('hidden');
        
        // Display user's first name on the button
        const firstName = user.name.split(' ')[0];
        profileNameSpan.textContent = firstName;
    } else {
        // User is logged out: Show Login, Hide User Profile
        loginBtn.classList.remove('hidden');
        userProfileBtn.classList.add('hidden');
    }
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
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();
    
    if (!email || !password) {
        displayMessage(loginModal, 'Please enter both email and password.', true);
        return;
    }

    const fakeUser = {
        name: "User", 
        email: email,
    };

    localStorage.setItem("currentUser", JSON.stringify(fakeUser));
    displayMessage(loginModal, `Logged in as ${fakeUser.name}`, false);
    
    loginEmailInput.value = '';
    loginPasswordInput.value = '';

    closeModal('loginModal');
    updateHeaderUI(fakeUser);
}

function signupUser() {
    const name = signupNameInput.value.trim();
    const email = signupEmailInput.value.trim();
    const password = signupPasswordInput.value.trim();

    if (!name || !email || !password) {
        displayMessage(signupModal, 'Please fill all fields to sign up.', true);
        return;
    }

    const newUser = { name, email };

    localStorage.setItem("currentUser", JSON.stringify(newUser));
    displayMessage(signupModal, `Signed up and logged in as ${name}`, false);
    
    signupNameInput.value = '';
    signupEmailInput.value = '';
    signupPasswordInput.value = '';

    closeModal('signupModal');
    updateHeaderUI(newUser);
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    console.log('User logged out.'); // Use console log for system actions
    

    if (profileModal.style.display === 'flex') {
        closeModal('profileModal');
    }
    
    updateHeaderUI(null);
}

function displayUserProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user) {
        profileNameElement.textContent = user.name;
        profileEmailElement.textContent = user.email;
        openModal('profileModal');
    } else {
        console.error('User data not found. Redirecting to login.');
        logoutUser(); 
        openModal('loginModal');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    updateHeaderUI(currentUser);

    loginBtn.addEventListener('click', () => openModal('loginModal'));

    userProfileBtn.addEventListener('click', displayUserProfile);
    
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if(modal) {
                closeModal(modal.id);
            }
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) closeModal('loginModal');
        if (event.target === signupModal) closeModal('signupModal');
        if (event.target === profileModal) closeModal('profileModal');
    });
    window.loginUser = loginUser;
    window.signupUser = signupUser;
    window.logoutUser = logoutUser;
    window.switchToLogin = switchToLogin;
    window.switchToSignup = switchToSignup;
    window.closeModal = closeModal;
});

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    updateHeaderUI(currentUser);
});
