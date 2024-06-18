import express from 'express';
import CartsDAO from '../dao/carts.dao.js';
import ProductsDAO from '../dao/products.dao.js';
import TicketDAO from '../dao/ticket.dao.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/:cid/purchase', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const userEmail = req.user.email;
    const userCart = await CartsDAO.getCartById(cartId);
    const productsToPurchase = userCart.products;
    const totalAmount = req.body.totalAmount;
    
    const purchasedProducts = [];
    const productsNotPurchased = [];

    for (const product of productsToPurchase) {
      const availableProduct = await ProductsDAO.getById(product.productId);

      if (availableProduct.stock >= product.quantity) {
        availableProduct.stock -= product.quantity;
        await availableProduct.save();
        purchasedProducts.push(product);
      } else {
        productsNotPurchased.push(product.productId);
      }
    }

    const code = generateUniqueCode(); // Generar el código único
    const ticketData = {
      code: code,
      amount: totalAmount,
      purchaser: userEmail
    };
    
    // Crear un ticket con el código generado
    const ticket = await TicketDAO.createTicket(ticketData);

    // Redirigir a la página de confirmación de compra con el código pasado como parámetro
    const redirectUrl = `/carts/${cartId}/purchase_confirmation?code=${code}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error al finalizar la compra:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

function generateUniqueCode() {
  return uuidv4().toUpperCase();
}

export default router;



