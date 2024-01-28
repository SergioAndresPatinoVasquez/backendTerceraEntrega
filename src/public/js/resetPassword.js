document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordForm');

    resetPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(resetPasswordForm);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje de éxito
                const result = await response.json();
                alert(result.message);
            } else {
                // Manejar errores, por ejemplo, mostrar un mensaje de error
                const error = await response.json();
                alert(error.error);
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
        }
    });
});
