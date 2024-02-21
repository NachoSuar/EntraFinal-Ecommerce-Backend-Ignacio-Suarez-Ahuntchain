// cart.schema.js
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',  
    required: true,
  },
  quantity: {
    type: mongoose.Schema.Types.Mixed,
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




