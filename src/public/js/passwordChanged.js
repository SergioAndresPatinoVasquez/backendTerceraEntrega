
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('changedPasswordForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const obj = {};

        data.forEach((value, key) => (obj[key] = value));

        try {
            const response = await fetch('/api/users/password-changed', {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                window.location.replace('/login')
                alert('Contraseña cambiada exitosamente');
            } else {
                // Puedes redirigir a otra página o manejar el error de alguna manera
                alert('Error al cambiar la contraseña');
                console.error('Error al cambiar la contraseña');
            }

        } catch (error) {
            console.error('Error durante el cambio de contraseña:', error);
        }
    });
});
