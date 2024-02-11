import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Pruebas de integración módulo de usuarios', () => {
    it('Debemos registrar un usuario correctamente', async () => {
        const userMock = {
            first_name: 'CODER',
            last_name: 'HOUSE',
            email: 'coderhouse@example.com',
            age: 99,
            role: 'ADMIN',
            password: 'password123'
        };


        try {
            const { statusCode, body } = await requester.post('/api/users/register').send(userMock);
            console.log('Response:', statusCode, body);
            expect(statusCode).to.be.oneOf([201, 400]);  
            if (statusCode === 201) {
                expect(body.status).to.equal('success');
                expect(body).to.have.property('access_token');
            } else if (statusCode === 400 && body.error === 'UserError' && body.description === 'user already exists') {
                console.log('User already exists. Test passed.');
            } else {
                console.error('Error in test:', body);
                throw new Error('Unexpected response');
            }
        } catch (error) {
            console.error('Error in test:', error.response ? error.response.body : error.message);
            throw error;
        }

    })

    it('Debemos loggear un usuario y retornar una cookie', async () => {
        const credentialsMock = {
            email: 'coderhouse@example.com',
            password: 'password123'
        };

        try {
            const response = await requester.post('/api/users/login').send(credentialsMock);
            expect(response.statusCode).to.be.eql(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('login success');

            // Verificar la existencia y validez de la cookie
            const cookie = response.headers['set-cookie'];
            console.log('Cookie:', cookie);  // Agrega este log
            expect(cookie).to.be.an('array');
            expect(cookie).to.satisfy(cookies => cookies.some(c => c.includes('coderCookieToken')));
        } catch (error) {
            console.error('Error in login test:', error.response ? error.response.body : error.message);
            throw error;
        }

    })
})