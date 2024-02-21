import Cart from './models/cart.schema.js';
import ProductsDAO from './products.dao.js';
import mongoose from 'mongoose';

class CartsDAO {
    static async deleteProduct(cartId, productId) {
        try {
            const cart = await Cart.findByIdAndUpdate(
                cartId,
                { $pull: { products: { productId } } },
                { new: true }
            ).populate('products.productId');

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            console.error('Error en deleteProduct:', error);
            throw error;
        }
    }

    static async addToCart(productId, quantity) {
        try {
            // Lógica para agregar el producto al carrito
            const cart = await Cart.findOneAndUpdate(
                {},  // Sin condición para seleccionar un carrito específico
                { $push: { products: { productId, quantity } } },
                { upsert: true, new: true }
            ).populate('products.productId');
    
            if (!cart) {
                throw new Error('No se pudo encontrar ni crear el carrito');
            }
    
            return cart;  // Agrega esta línea para devolver el carrito actualizado
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            throw error;
        }
    }

    static async getOrCreateCart() {
        try {
            // Crea un nuevo carrito sin asignar a un usuario específico
            const newCart = new Cart({ products: [], userId: null }); // Agrega userId: null
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error al obtener o crear el carrito:', error);
            throw error;
        }
    }
}

export default CartsDAO;


