import express from 'express';
import CartsDAO from '../dao/carts.dao.js';
import ProductsDAO from '../dao/products.dao.js';
import Products from '../dao/models/products.schema.js';
import mongoose from 'mongoose';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const userId = req.user._id; // Obtener el userId de la solicitud (de tu lógica de autenticación)

        // Obtener el carrito asociado al userId
        const userCart = await CartsDAO.getOrCreateCart(userId);

        // Obtener los IDs de los productos asociados al carrito
        const productIds = userCart.products.map(product => product.productId);

        // Renderizar la plantilla con los datos del carrito y los IDs de los productos
        res.render('carritos', { cart: userCart, productIds });
    } catch (error) {
        console.error('Error al obtener el carrito del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});





// Ruta para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const updatedCart = await CartsDAO.deleteProduct(cartId, productId);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});


router.get('/add/:productId', async (req, res) => {
    const productId = req.params.productId;

    // Verifica si el usuario está autenticado
    if (!req.user) {
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión o muestra un mensaje de error
        return res.status(401).send('Debe iniciar sesión para agregar productos al carrito');
    }

    const userId = req.user._id; // Utiliza el ID del usuario autenticado como ObjectId

    // Verifica que el productId no esté vacío antes de continuar
    if (!productId) {
        return res.status(400).send('Error: productId no válido');
    }

    try {
        // Obtener o crear el carrito para el usuario
        const userCart = await CartsDAO.getOrCreateCart(userId);

        // Agregar el producto al carrito
        await CartsDAO.addToCart(userCart._id, productId, new mongoose.Types.ObjectId(userId));

        // Redirigir o enviar una respuesta adecuada según tu aplicación
        res.redirect('/carts');
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});



export default router;



