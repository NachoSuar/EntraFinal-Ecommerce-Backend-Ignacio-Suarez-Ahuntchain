import request from 'supertest';
import app from '../app.js';
import { assert } from 'chai';
import Products from '../dao/models/products.schema.js';
import mongoose from 'mongoose';

describe('Products Router', () => {
    let testProductId = '65d54552d48a21c22e26762b';

    it('should return status 200 and an object with a payload property containing an array of products', async () => {
        const res = await request(app).get('/products');
        assert.equal(res.status, 200);
        assert.isObject(res.body); // Verifica que la respuesta sea un objeto JSON
        // También puedes realizar más verificaciones sobre la estructura de cada producto en el array si es necesario
    });

    it('should return status 400 for an invalid product ID', async () => {
        const res = await request(app).get('/products/invalid-id');
        assert.equal(res.status, 400);
        assert.equal(res.text, 'ID de producto no válido');
    });

    it('should return status 404 for a non-existent product', async () => {
        const nonExistentProductId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/products/${nonExistentProductId}`);
        assert.equal(res.status, 404);
        // No es necesario verificar res.body.error porque se está renderizando una vista, no devolviendo un JSON
    });

    it('should return status 200 and the correct product details', async () => {
        const res = await request(app).get(`/products/${testProductId}`);
        assert.equal(res.status, 200);
        // Dado que se está renderizando una vista, no puedes verificar res.body directamente.
        // En su lugar, verifica que la vista renderizada contiene los datos correctos.
        assert.include(res.text, "Crema");
        assert.include(res.text, "Crema facial");
        assert.include(res.text, "1707713547037-155458035.png");
        assert.include(res.text, "5000");
        assert.include(res.text, "true"); // Verifica si hay stock
    });

    // // Prueba adicional para la ruta específica
    // it('should return status 200 and render the product page for a valid product ID', async () => {
    //     const res = await request(app).get(`/products/${testProductId}`);
    //     assert.equal(res.status, 200);
    //     // Verifica que la respuesta contenga el título del producto
    //     assert.include(res.text, "Crema");
    //     // Verifica que la respuesta contenga la descripción del producto
    //     assert.include(res.text, "Descripción de la crema");
    //     // Verifica que la respuesta contenga la foto del producto
    //     assert.include(res.text, "foto.jpg");
    //     // Verifica que la respuesta contenga el precio del producto
    //     assert.include(res.text, "5000");
    //     // Verifica que la respuesta contenga la información del stock
    //     assert.include(res.text, "true"); // O "false" si el stock es 0
    // });
});


