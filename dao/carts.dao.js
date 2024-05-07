import Cart from './models/cart.schema.js';
import ProductsDAO from './products.dao.js';
import mongoose from 'mongoose';
import UsersDAO from './users.dao.js';
import { ObjectId } from 'mongoose';
import { Types } from 'mongoose';

const newObjectId = new Types.ObjectId();
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

    

    static async addToCart(cartId, productId, userId) {
        try {
            // Verificar si el usuario es premium
            const user = await UsersDAO.getUserByID(userId);
            if (user.role === 'premium') {
                // Verificar si el producto pertenece al usuario
                const product = await ProductsDAO.getById(productId);
                if (product.owner === userId) {
                    throw new Error('Un usuario premium no puede agregar su propio producto al carrito.');
                }
            }
    
            // Agregar el producto al carrito del usuario
            const updatedCart = await Cart.findByIdAndUpdate(
                cartId,
                { $push: { products: productId } },
                { new: true }
            ).populate('products');
    
            return updatedCart;
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            throw error;
        }
    }
    
    
    
    static async getOrCreateCart(userId) {
        try {
            // Buscar un carrito asociado con el usuario actual
            let userCart = await Cart.findOne({ userId });
    
            // Si no hay un carrito asociado, crear uno nuevo
            if (!userCart) {
                userCart = new Cart({ userId, products: [] });
                await userCart.save();
            }
    
            return userCart;
        } catch (error) {
            console.error('Error al obtener o crear el carrito:', error);
            throw error;
        }
    }
    
    static async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products');
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw error;
        }
    }    
}

export default CartsDAO;



