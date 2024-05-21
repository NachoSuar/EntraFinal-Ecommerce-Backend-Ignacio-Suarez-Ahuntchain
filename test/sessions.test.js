import request from 'supertest';
import app from '../app.js';
import { assert } from 'chai';
import UsersDAO from '../dao/users.dao.js'; 

describe('Sessions Router', () => {
    it('should return status 200 and a session token on successful login', async () => {
        // Hacer una solicitud de inicio de sesión con credenciales reales (datos de prueba)
        const res = await request(app)
            .post('/login')
            .send({ email: 'a@gmail.com', password: '123' });

        // Verificar que la respuesta redirija a /products
        assert.equal(res.status, 302);
        assert.equal(res.headers.location, '/products');
    });

    it('should return status 401 on unsuccessful login', async () => {
        // Hacer una solicitud de inicio de sesión con credenciales inválidas
        const res = await request(app)
            .post('/login')
            .send({ email: 'correo_invalido', password: 'contraseña_invalida' });

        // Verificar que la respuesta sea un código 401
        assert.equal(res.status, 401);
    });

    it('should return status 401 and an error message on unsuccessful login', async () => {
        // Hacer una solicitud de inicio de sesión con credenciales inválidas
        const res = await request(app)
            .post('/login')
            .send({ email: 'correo_invalido', password: 'contraseña_invalida' });

        // Verificar que la respuesta sea un código 401 y contenga un mensaje de error
        assert.equal(res.status, 401);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Failed login. Invalid username or password.');
    });
});









