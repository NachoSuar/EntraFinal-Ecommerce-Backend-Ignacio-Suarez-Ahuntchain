import request from 'supertest';
import app from '../app.js';
import { assert } from 'chai';
import usersSchema from '../dao/models/users.schema.js';
import Cart from '../dao/models/cart.schema.js';

describe('Carts Router', () => {
    const userId = '663981bcdc7f3bcbc076f1a8'; // ID de usuario conocido

    it('should return status 200 and the user\'s cart', (done) => {
        request(app)
            .get(`/carts/${userId}`) // Usa el userId conocido en la URL
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.isObject(res.body);
                done();
            });
    });


});

