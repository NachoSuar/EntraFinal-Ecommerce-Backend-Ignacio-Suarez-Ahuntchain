import Cart from './models/cart.schema.js';
import ProductsDAO from './products.dao.js';

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
                { new: true, upsert: true }
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
    
    
}

export default CartsDAO;


