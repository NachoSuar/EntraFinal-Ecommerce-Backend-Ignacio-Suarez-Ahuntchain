import { Router } from "express";
import upload from "../utils/upload.middleware.js";
import ProductsDAO from "../dao/products.dao.js";
import MessagesDAO from "../dao/db/messages.dao.js";
import { isValidObjectId } from 'mongoose';


const router = Router();
export default router;

// /products -> Muestro todos los productos
// /products?stock -> Muestre todos los productos con stock
router.get("/", async (req, res) => {
    try {
        let withStock = req.query.stock;
    
        let products;
        if (withStock === undefined) {
            products = await ProductsDAO.getAll();
        } else {
            products = await ProductsDAO.getAllWithStock();
        }
    
        res.render("products", { products });
    } catch (error) {
        console.error('Error al renderizar la vista products:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// /products/new
router.get("/new", (req, res) => {
    try {
        res.render("new-product");
    } catch (error) {
        console.error('Error al renderizar la vista new-product:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Ruta para mostrar el formulario de eliminación
router.get("/remove", (req, res) => {
    console.log('Intentando renderizar la vista remove-product');

    try {
        res.render("remove-product");
        console.log('Vista remove-product renderizada con éxito');
    } catch (error) {
        console.error('Error al renderizar la vista remove-product:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// /products/:id (Visualizar un producto)
router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;

        console.log('ID del producto:', id);

        // Verifica si id es un ObjectId válido antes de intentar obtener el producto
        if (!isValidObjectId(id)) {
            return res.status(400).send('ID de producto no válido');
        }

        let product = await ProductsDAO.getById(id);

        if (!product) {
            res.render("404");
        }

        res.render("product", {
            title: product.title,
            description: product.description,
            photo: product.photo,
            price: product.price,
            isStock: product.stock > 0,
        });
    } catch (error) {
        console.error('Error al renderizar la vista product:', error);
        res.status(500).send('Error interno del servidor');
    }
});


router.post("/", upload.single('image'), async (req, res) => {
    try {
        let filename = req.file.filename;
        let product = req.body;

        await ProductsDAO.add(product.title, product.description, filename, product.price, product.stock);
        res.redirect("/products");
    } catch (error) {
        console.error('Error al procesar la solicitud de agregar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});



// Ruta para mostrar el formulario de eliminación basada en ID
router.get('/remove/:id', async (req, res) => {
    const id = req.params.id;

    console.log('Llegó a la ruta de remove GET');

    try {
        const product = await ProductsDAO.getById(id);

        if (!product) {
            return res.status(404).render('404'); // Producto no encontrado
        }

        res.render('remove-product', { product });
    } catch (error) {
        console.error('Error al obtener el producto para eliminar:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Página principal del chat
router.get("/chat", (req, res) => {
    const allMessages = MessagesDAO.getAll();
    res.render("chat", { messages: allMessages });
});

// Manejo del formulario para agregar mensajes al chat
router.post("/chat", (req, res) => {
    try {
        const { user, message } = req.body;

        // Verifica si los datos se están recibiendo correctamente
        console.log("Datos recibidos del cliente:", { user, message });

        // Validación simple de datos
        if (!user || !message) {
            return res.status(400).json({ error: "Nombre de usuario y mensaje son obligatorios" });
        }

        // Agrega el mensaje a la "base de datos" (array en memoria)
        MessagesDAO.add(user, message);

        // Redirige a la página del chat
        res.redirect("/products/chat");
    } catch (error) {
        console.error('Error al procesar la solicitud de agregar mensaje:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});






