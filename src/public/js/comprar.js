document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");

    const forms = document.querySelectorAll('#comprarForm');
    console.log('Número de formularios encontrados:', forms.length);

    forms.forEach(form => {
        console.log('Iterando sobre un formulario');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Acceder a los datos del formulario
            const price = form.querySelector('.comprar').getAttribute('data-price');

            // Acceder directamente al correo electrónico del usuario
            const userEmail = document.querySelector('p[data-user-email]').getAttribute('data-user-email');
            
            // Imprimir en la consola la información
            console.log("El cliente compró");
            console.log("El precio es:", price);
            console.log("Correo del usuario:", userEmail);

            // Crear una nueva instancia de URLSearchParams para enviar los datos al servidor
            const params = new URLSearchParams();
            params.append('precio total', price);
            params.append('userEmail', userEmail);

            console.log('Enviando solicitud de compra con los siguientes datos:');
            console.log('price:', price);
            console.log('userEmail:', userEmail);

            // Realizar una solicitud POST al servidor
            try {
                const response = await fetch('/comprar', {
                    method: 'POST',
                    body: params,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                const data = await response.text();
                console.log('Respuesta del servidor:', data);

                // Mostrar un mensaje en el navegador
                alert('Compra exitosa. La factura ha sido enviada a tu correo electrónico.');
            } catch (error) {
                console.error('Error en la solicitud:', error);
                // Manejar errores según sea necesario
            }
        });
    });
});
