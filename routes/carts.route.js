import express from 'express';
import CartsDAO from '../dao/carts.dao.js';

const router = express.Router();

router.get('/', (req, res) => {
    // Lógica para mostrar la página de carritos
    res.render('carritos');
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


// Ruta del carrito para agregar un producto por ID
router.get('/add/:productId', async (req, res) => {
    const productId = req.params.productId; // Obtener productId de la URL

    // Asegúrate de que productId no esté vacío antes de continuar
    if (!productId) {
        return res.status(400).send('Error: productId no válido');
    }

    try {
        // No se necesita ningún userId, simplemente obtén o crea el carrito sin depender de la información del usuario
        const userCart = await CartsDAO.getOrCreateCart();

        // Agrega el producto al carrito
        await CartsDAO.addToCart(userCart._id, productId, 1);

        // Redirige a la página de carritos o a donde prefieras
        res.redirect('/carts');
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});










export default router;


