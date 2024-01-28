// newPassword.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
  
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const email = document.getElementsByName('email')[0].value;
  
      try {
        const response = await fetch('/api/users/password-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        if (response.ok) {
          const result = await response.json();
          alert(result.message); // Muestra un mensaje de éxito (puedes personalizarlo)
        } else {
          const error = await response.json();
          alert(error.error); // Muestra un mensaje de error
        }
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Error al enviar la solicitud');
      }
    });
  });