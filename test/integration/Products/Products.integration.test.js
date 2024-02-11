import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Pruebas de integración módulo de productos', () => {
    let token;  // Variable para almacenar el token de autenticación

    before(async () => {
        // Realizar el inicio de sesión y obtener el token
        const credentialsMock = {
            email: 'coderhouse@example.com',
            password: 'password123'
        };
    
        try {
            const response = await requester.post('/api/users/login').send(credentialsMock);
            expect(response.statusCode).to.be.eql(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('login success');
    
            // Obtener la cookie y extraer el token
            const cookie = response.headers['set-cookie'];
            const tokenMatch = cookie && cookie[0] && cookie[0].match(/coderCookieToken=([^;]*)/);
            
            if (tokenMatch) {
                token = tokenMatch[1];
                console.log("token es :", token);
            } else {
                throw new Error('Token not found in cookie');
            }
        } catch (error) {
            console.error('Error during login:', error.response ? error.response.body : error.message);
            throw error;
        }
    });

    it('Debería obtener todos los productos para un usuario autenticado con el rol correcto', async () => {

        const response = await requester.get('/api/products').set('Authorization', `Bearer ${token}`);
        console.log('Response:', response.statusCode, response.body);

        // Verificar que la solicitud sea exitosa (código 200) y contiene la lista de productos
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property('products');
    });

   
});
