document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = '';
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        try {
            const response = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                window.location.href = 'index.html';
            } else {
                errorMessage.textContent = data.message || 'Ocurrió un error.';
            }
        } catch (error) {
            errorMessage.textContent = 'No se pudo conectar con el servidor.';
        }
    });
});