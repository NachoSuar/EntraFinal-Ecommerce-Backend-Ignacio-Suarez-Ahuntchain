import express from 'express';
import CartsDAO from '../dao/carts.dao.js';
import ProductsDAO from '../dao/products.dao.js';
import Ticket from '../models/TicketSchema.js';

const router = express.Router();

router.post('/:cid/purchase', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const userId = req.user._id;
    const userCart = await CartsDAO.getCartById(cartId);
    const productsToPurchase = userCart.products;

    const purchasedProducts = [];
    const productsNotPurchased = [];

    for (const product of productsToPurchase) {
      const availableProduct = await ProductsDAO.getById(product.productId);

      if (availableProduct.stock >= product.quantity) {
        // El producto tiene suficiente stock, restarlo del inventario
        availableProduct.stock -= product.quantity;
        await availableProduct.save();

        // Agregar el producto a la lista de productos comprados
        purchasedProducts.push(product);
      } else {
        // No hay suficiente stock del producto, agregar a la lista de productos no comprados
        productsNotPurchased.push(product.productId);
      }
    }

    // Crear un nuevo ticket con los datos de la compra
    const ticket = new Ticket({
      code: generateUniqueCode(),
      amount: calculateTotalAmount(purchasedProducts),
      purchaser: req.user.email
    });
    await ticket.save();

    // Actualizar el carrito con los productos que no se pudieron comprar
    await CartsDAO.updateCartWithNotPurchasedProducts(cartId, productsNotPurchased);

    res.status(200).json({ message: 'Compra realizada con éxito', ticket });
  } catch (error) {
    console.error('Error al finalizar la compra:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Función para generar un código único para el ticket
function generateUniqueCode() {
  // lógica para generar un código único a definir posiblemente use ShortId
}

// Función para calcular el monto total de la compra
function calculateTotalAmount(products) {
    let totalAmount = 0;
    for (const product of products) {
        totalAmount += product.price * product.quantity;
    }
    return totalAmount;
}
