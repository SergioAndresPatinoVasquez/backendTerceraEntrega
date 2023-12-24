// public/js/register.js
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registrationForm);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Registro exitoso, redirige a la vista de login
                window.location.href = '/login';
            } else {
                const error = await response.json();
                alert(error.error);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    });
});

