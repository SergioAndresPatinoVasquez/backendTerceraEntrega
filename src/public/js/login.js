// login.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const obj = {};

        data.forEach((value, key) => (obj[key] = value));

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
               window.location.replace('/products')
              } else {
                location.href = '/login'
              }


        } catch (error) {
            console.error('Error during login:', error);
        }
    });
});

