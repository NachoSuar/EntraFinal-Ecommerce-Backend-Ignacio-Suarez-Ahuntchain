import { Router } from "express";
import upload from "../utils/upload.middleware.js";
import ProductsDAO from "../dao/products.dao.js";
import MessagesDAO from "../dao/db/messages.dao.js";
import { isValidObjectId } from 'mongoose';
import { checkAdmin, checkUser, checkUserPremiun } from "../utils/permissions.middleware.js";
import customizeError from "../errorCustom/errorCustom.js";

const router = Router();
export default router;

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Devuelve la lista de productos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: stock
 *         schema:
 *           type: boolean
 *         description: Only return products with stock
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */

// /products -> Muestro todos los productos
// /products?stock -> Muestre todos los productos con stock
router.get("/", async (req, res) => {
    try {
        let withStock = req.query.stock;
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let sort = req.query.sort === 'desc' ? -1 : 1;
        let query = req.query.query || '';

        let skip = (page - 1) * limit;

        let products;
        let totalCount;

        if (withStock === undefined) {
            if (query) {
                // Realizar búsqueda con filtro
                console.log('Búsqueda con filtro - Parámetros:', { query, limit, skip, sort });  // Agregado
                products = await ProductsDAO.getByFilter(query, limit, skip, sort);
                totalCount = await ProductsDAO.getCountByFilter(query);
            } else {
                // Realizar búsqueda general
                console.log('Búsqueda general - Parámetros:', { limit, skip, sort });  // Agregado
                products = await ProductsDAO.getAll(limit, skip, sort);
                totalCount = await ProductsDAO.getCount();
            }
        } else {
            // Realizar búsqueda con stock
            console.log('Búsqueda con stock - Parámetros:', { limit, skip, sort });  // Agregado
            products = await ProductsDAO.getAllWithStock(limit, skip, sort);
            totalCount = await ProductsDAO.getCountWithStock();
        }

        const totalPages = Math.ceil(totalCount / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevLink = hasPrevPage ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null;
        const nextLink = hasNextPage ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null;

        const result = {
            status: 'success',
            payload: products,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        };


        res.render("products", { result });
    } catch (error) {
        console.error('Error al renderizar la vista products:', error);
        res.status(500).send('Error interno del servidor');
    }
});

/**
 * @swagger
 * /products/new:
 *   get:
 *     summary: Renderiza el formulario para crear un nuevo producto
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: New product form
 *       403:
 *         description: Permission denied
 *       500:
 *         description: Internal server error
 */

router.get("/new", (req, res, next) => {
    // Verifica si el usuario está autenticado y tiene uno de los roles permitidos
    if (req.user && (req.user.role === 'admin' || req.user.role === 'premium')) {
        return next(); // Permite el acceso
    } else {
        // Si el usuario no cumple con los requisitos, envía un mensaje de error
        res.status(403).send(customizeError('PERMISSION_DENIED3'));
    }
}, (req, res) => {
    try {
        res.render("new-product");
    } catch (error) {
        console.error('Error al renderizar la vista new-product:', error);
        res.status(500).send('Error interno del servidor');
    }
});

/**
 * @swagger
 * /products/remove:
 *   get:
 *     summary: Muestra el formulario para eliminar un producto
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Remove product form
 *       403:
 *         description: Permission denied
 *       500:
 *         description: Internal server error
 */

// Ruta para mostrar el formulario de eliminación
router.get("/remove", checkAdmin, (req, res) => {
    console.log('Intentando renderizar la vista remove-product');
    try {
        res.render("remove-product");
        console.log('Vista remove-product renderizada con éxito');
    } catch (error) {
        console.error('Error al renderizar la vista remove-product:', error);
        res.status(500).send('Error interno del servidor');
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Recupera un solo producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

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
            productId: id, // Pasa el productId a la vista
        });
    } catch (error) {
        console.error('Error al renderizar la vista product:', error);
        res.status(500).send('Error interno del servidor');
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created
 *       500:
 *         description: Internal server error
 */

router.post("/", (req, res, next) => {
    // Verifica si el usuario está autenticado y tiene uno de los roles permitidos
    if (req.user && (req.user.role === 'admin' || req.user.role === 'premium')) {
        return next(); // Permite el acceso
    } else {
        // Si el usuario no cumple con los requisitos, envía un mensaje de error
        res.status(403).send(customizeError('PERMISSION_DENIED'));
    }
}, upload.single('image'), async (req, res) => {
    try {
        console.log('Archivo de imagen cargado:', req.file);

        // Obtener el nombre del archivo de la imagen cargada
        const filename = req.file.filename;

        // Obtener los datos del producto del cuerpo de la solicitud
        const { title, description, price, stock } = req.body;

        // Obtener el correo electrónico del usuario autenticado
        const owner = req.user.email;

        // Llamada al método add de ProductsDAO para agregar el producto
        await ProductsDAO.add(title, description, filename, price, stock, owner);

        // Redireccionar al usuario a la página de productos después de agregar el producto
        res.redirect("/products");
    } catch (error) {
        console.error('Error al procesar la solicitud de agregar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Elimina un producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */

router.delete("/:id", checkAdmin, checkUserPremiun, async (req, res) => {
    try {
        // Obtener el ID del producto de los parámetros de la URL
        const productId = req.params.id;

        // Obtener el correo electrónico del usuario autenticado
        const owner = req.user.email;

        // Obtener el producto por su ID
        const product = await ProductsDAO.getById(productId);

        // Verificar si el producto existe y si el usuario autenticado es el propietario o es administrador
        if (!product || (product.owner !== owner && req.user.role !== 'admin')) {
            // Si el producto no existe, o el usuario no es el propietario ni es administrador, enviar un mensaje de error
            return res.status(403).send("No tienes permiso para eliminar este producto.");
        }

        // Si el producto existe y el usuario es el propietario o es administrador, eliminar el producto
        await ProductsDAO.remove(productId);

        // Redireccionar al usuario a la página de productos después de eliminar el producto
        res.redirect("/products");
    } catch (error) {
        console.error('Error al procesar la solicitud de eliminar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Ruta para mostrar el formulario de eliminación basada en ID
router.get('/remove/:id', checkAdmin, async (req, res) => {
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
router.get("/chat", checkUser, (req, res) => {
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






