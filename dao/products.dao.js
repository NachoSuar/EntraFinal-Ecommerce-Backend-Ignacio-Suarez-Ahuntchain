import Products from "./models/products.schema.js";
import Cart from "./models/cart.schema.js";
import Message from "./models/message.schema.js";
import mongoose from 'mongoose';
import { isValidObjectId } from 'mongoose';


class ProductsDAO {

    static async getAll(limit, skip, sort) {
        try {
            console.log('Parámetros de la consulta getAll:', { limit, skip, sort });  // Agregado
            const query = Products.find().limit(limit).skip(skip).sort({ price: sort });
            const products = await query.lean();
    
            // Imprime la consulta en la consola
            console.log('Consulta getAll:', query.getQuery());
    
            return products;
        } catch (error) {
            console.error("Error en getAll:", error);
            throw error;
        }
    }
    
    

    static async getAllWithStock(limit, skip, sort) {
        try {
            return await Products.find({ stock: { $gt: 0 } }).limit(limit).skip(skip).sort({ price: sort }).lean();
        } catch (error) {
            console.error("Error en getAllWithStock:", error);
            throw error;
        }
    }

    static async getByFilter(query, limit, skip, sort) {
        try {
            // Implementa lógica para realizar búsqueda por filtro (puede variar según tus necesidades)
            return await Products.find({ title: { $regex: query, $options: 'i' } }).limit(limit).skip(skip).sort({ price: sort }).lean();
        } catch (error) {
            console.error("Error en getByFilter:", error);
            throw error;
        }
    }


    static async getById(id) {
        try {
            if (!mongoose.isValidObjectId(id)) {
                throw new Error('ID de producto no válido');
            }

            const product = await Products.findOne({ _id: id }).lean();

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product;
        } catch (error) {
            console.error("Error en getById:", error);
            throw error;
        }
    }

    static async add(title, description, photo, price, stock, owner = "admin") {
        try {
            return await new Products({ title, description, photo, price, stock, owner }).save();
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }
    

    static async update(id, data) {
        try {
            return await Products.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    static async remove(id) {
        try {
            const removedProduct = await Products.findByIdAndDelete(id);
            if (!removedProduct) {
                throw new Error('Producto no encontrado');
            }
            return removedProduct;
        } catch (error) {
            console.error("Error en remove:", error);
            throw error;
        }
    }
    

    static async addToCart(userId, productId, quantity) {
        try {
            if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
                throw new Error('ID de usuario o producto no válido');
            }

            const cart = await Cart.findOne({ userId });

            if (!cart) {
                await Cart.create({ userId, products: [{ productId, quantity }] });
            } else {
                cart.products.push({ productId, quantity });
                await cart.save();
            }

        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            throw error;
        }
    }

    static async getAllMessages() {
        try {
            return await Message.find().lean();
        } catch (error) {
            console.error("Error al obtener mensajes:", error);
            throw error;
        }
    }
    
    static async addMessage(user, content) {
        try {
            await Message.create({ user, content });
        } catch (error) {
            console.error("Error al agregar mensaje:", error);
            throw error;
        }
    }

    static async getCount() {
        try {
            return await Products.countDocuments();
        } catch (error) {
            console.error("Error en getCount:", error);
            throw error;
        }
    }

    static async getCountWithStock() {
        try {
            return await Products.countDocuments({ stock: { $gt: 0 } });
        } catch (error) {
            console.error("Error en getCountWithStock:", error);
            throw error;
        }
    }

    static async getCountByFilter(query) {
        try {
            // Implementa lógica para contar productos por filtro (puede variar según tus necesidades)
            return await Products.countDocuments({ title: { $regex: query, $options: 'i' } });
        } catch (error) {
            console.error("Error en getCountByFilter:", error);
            throw error;
        }
    }
}    

export default ProductsDAO;

