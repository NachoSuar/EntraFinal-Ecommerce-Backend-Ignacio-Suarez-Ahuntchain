import mongoose from 'mongoose';

const ProductsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    photo:{
        type:String
    },
    owner: {
        type: String,
        required: true,
    }
});

// Registrar el modelo "Products" antes de exportarlo
const Products = mongoose.model("Products", ProductsSchema);

// Exportar el modelo "Products"
export default Products;

