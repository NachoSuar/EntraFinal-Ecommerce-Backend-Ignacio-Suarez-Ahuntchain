import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
    required: true,
  }],
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;





