// cart.schema.js
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: mongoose.Schema.Types.Mixed,  // Acepta números y strings
    required: true,
  },
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  products: [CartItemSchema],
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;



