// carts.schema.js
import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',  // Hace referencia al modelo de Products
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;


