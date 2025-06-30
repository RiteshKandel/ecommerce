const form = document.getElementById('auth-form');
const toggleLink = document.getElementById('toggle-link');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const errorMsg = document.getElementById('error-msg');

let isLogin = true;

function setMode(login) {
    isLogin = login;
    formTitle.textContent = login ? 'Login' : 'Sign Up';
    submitBtn.textContent = login ? 'Login' : 'Sign Up';
    toggleLink.textContent = login ? "Don't have an account? Sign up" : "Already have an account? Login";
    errorMsg.textContent = '';
}

toggleLink.onclick = () => setMode(!isLogin);

form.onsubmit = async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!email || !password) {
        errorMsg.textContent = 'Please fill in all fields.';
        return;
    }
    const endpoint = isLogin ? 'https://89a5-103-163-182-184.ngrok-free.app/api/auth/login' : 'https://89a5-103-163-182-184.ngrok-free.app/api/auth/signup';
    try {
        const res = await fetch('https://89a5-103-163-182-184.ngrok-free.app' + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.status === 'success') {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            errorMsg.textContent = data.message || 'Authentication failed.';
        }
    } catch (err) {
        errorMsg.textContent = 'Server error. Please try again.';
    }
};

// If already logged in, redirect to index.html
if (localStorage.getItem('token')) {
    window.location.href = 'index.html';
} 
