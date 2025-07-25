document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordTextInput = document.getElementById('password-text');
    const showPasswordCheckbox = document.getElementById('show-password');
    const errorMessage = document.getElementById('error-message');
    if (!loginForm) return;

    passwordInput.addEventListener('input', () => passwordTextInput.value = passwordInput.value);
    passwordTextInput.addEventListener('input', () => passwordInput.value = passwordTextInput.value);
    showPasswordCheckbox.addEventListener('change', () => {
        const isChecked = showPasswordCheckbox.checked;
        passwordInput.classList.toggle('active', !isChecked);
        passwordTextInput.classList.toggle('active', isChecked);
        if (isChecked) { passwordTextInput.focus(); } else { passwordInput.focus(); }
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = '';
        const email = emailInput.value;
        const password = passwordInput.value;
        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem('authToken', data.token);
                window.location.href = 'dashboard.html';
            } else {
                errorMessage.textContent = data.message || 'Ocurrió un error.';
            }
        } catch (error) {
            errorMessage.textContent = 'No se pudo conectar con el servidor.';
        }
    });
});