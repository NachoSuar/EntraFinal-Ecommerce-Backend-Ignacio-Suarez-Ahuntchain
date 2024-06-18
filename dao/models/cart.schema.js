import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
    title: {  // Agrega el título del producto
      type: String,
      required: true,
    },
    price: {  // Agrega el precio del producto
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;








