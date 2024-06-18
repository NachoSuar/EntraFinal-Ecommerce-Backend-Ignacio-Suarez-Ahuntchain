import express from "express";
import { engine } from 'express-handlebars';
import mongoose from "mongoose";
import http from 'http';
import { Server } from 'socket.io'; 
import cartsRouter from "./routes/carts.route.js";
import Cart from './dao/models/cart.schema.js';
import prodsRouter from "./routes/products.route.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import sessionsRouter from './routes/session.js';
import viewRouter from "./routes/views.js"
import UsersDAO from "./dao/users.dao.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js";
import generateMockProducts from "./mocking/mocking.js";
import logger from "./loggertest/loggertest.js";
import swaggerRouter from "./swagger.js";
import swaggerSpec from "./swagger.js";
import swaggerUi from "swagger-ui-express";
import usersRouter from "./routes/users.router.js";
import Handlebars from 'handlebars';
import methodOverride from 'method-override';
import routesAdmin from './routes/admin.route.js'
import ticket from './routes/ticket.route.js'

// Función para validar ObjectId
function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}
initializePassport();

const app = express();
const server = http.createServer(app);
const io = new Server(server); 

// View engine
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Public folder
app.use(express.static('public'));

// Middlewares request
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());
app.use(session({
    store:MongoStore.create({
        mongoUrl:config.mongoDB.url,
        ttl: config.session.ttl,
    }),
    secret: config.session.secret,
    resave: true,
    saveUninitialized: true
}));

app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewRouter);
app.use('/api/users', routesAdmin);
app.use('/api/carts', ticket);

//Swagger
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));


// Middleware para cargar el usuario en sesión
app.use(async (req, res, next) => {
    const userId = req.session.user;
    console.log('Middleware de carga de usuario en sesión ejecutándose. Usuario en sesión:', userId);
    if (userId) {
        try {
            const user = await UsersDAO.getUserByID(userId);
            req.user = user; // Asigna el usuario a req.user
            console.log('Usuario cargado en sesión:', req.user);
        } catch (error) {
            console.error('Error al cargar usuario en sesión:', error);
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
});

// Middleware global para todas las rutas
app.use(async (req, res, next) => {
    if (req.session.user) {
        res.locals.user = await UsersDAO.getUserByID(req.session.user);
    } else {
        res.locals.user = null;
    }
    logger.debug(`Request received: ${req.method} ${req.url}`);
    next();
});

// Middleware para inicializar Passport y manejo de sesiones
app.use(passport.initialize());
app.use(passport.session());



// Define un helper llamado "multiply" que multiplica dos valores
Handlebars.registerHelper('multiply', function(a, b) {
    return a * b;
});

// Define un helper llamado "getTotalAmount" que calcula el monto total de la compra
Handlebars.registerHelper('getTotalAmount', function(products) {
    let totalAmount = 0;
    products.forEach(function(product) {
        totalAmount += product.price * product.quantity;
    });
    return totalAmount;
});

// Define un helper llamado "getQueryParam" que obtiene un parámetro de consulta de la URL
Handlebars.registerHelper('getQueryParam', function(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
});

// Define un helper llamado "eq" para admin
Handlebars.registerHelper('eq', function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

// Define un helper llamado "getParameterByName" que obtiene el valor de un parámetro de la URL por su nombre
Handlebars.registerHelper('getParameterByName', function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
});


// Configuración de Handlebars
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: { // Registra el helper getTotalAmount de forma global
        getTotalAmount: function(products) {
            let totalAmount = 0;
            products.forEach(function(product) {
                totalAmount += product.price * product.quantity;
            });
            return totalAmount;
        }
    }
}));

//Ruta de pago
app.get("/carts/:cid/purchase_confirmation", (req, res) => {
    const { code, amount, purchaser } = req.query;
    console.log('Ticket data:', { code, amount, purchaser }); // Log para verificar los datos del ticket
    res.render("purchase_confirmation", { ticket: { code, amount, purchaser } });
  });
  
// Middleware para interpretar el campo _method
app.use(methodOverride('_method'));

// Router productos
app.use("/products", prodsRouter);

// Router Carts
app.use("/carts", cartsRouter);

// Router Usuarios
app.use("/api/users", usersRouter);

app.get('/formulario', (req, res) => {
    // Lógica para renderizar el formulario
    res.render('formulario');
});

// Nueva ruta para eliminar productos
app.get("/products/remove", (req, res) => {
    console.log('Intentando renderizar la vista remove-product');

    try {
        res.render('remove-product');
        console.log('Vista remove-product renderizada con éxito');
    } catch (error) {
        console.error('Error al renderizar la vista remove-product:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Modelo del carrito
app.get('/mostrar_carrito', async (req, res) => {
    try {
      const carrito = await Cart.findOne({ });
      res.json(carrito);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el carrito');
    }
});

// Ruta para el endpoint /mockingproducts
app.get('/mockingproducts', async (req, res) => {
    console.log('Se ha llamado a la ruta /mockingproducts');
    try {
        const mockProducts = generateMockProducts(100); // Genera 100 productos de prueba
        res.json(mockProducts); // Devuelve los productos de prueba en formato JSON
    } catch (error) {
        console.error('Error al generar productos de prueba:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Definición del endpoint /loggerTest
app.get('/loggerTest', (req, res) => {
    logger.debug('Mensaje de debug desde /loggerTest');
    logger.info('Mensaje de info desde /loggerTest');
    logger.error('Mensaje de error desde /loggerTest');
    res.send('Logs enviados desde /loggerTest');
});

// Home del sitio
app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/ping", (req, res) => {
    res.send("Pong!");
});

app.get("/chat", (req, res) => {
    res.render("chat");
});

// Página error 404
app.use((req, res, next) => {
    res.render("404");
});

// Manejo de conexiones de socket
io.on('connection', (socket) => {
    console.log('Usuario conectado al chat');

    // Lógica para manejar mensajes de chat
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Envia el mensaje a todos los usuarios conectados
    });

    // Lógica para manejar desconexiones de usuarios
    socket.on('disconnect', () => {
        console.log('Usuario desconectado del chat');
    });
});

// Conexión MongoDB
mongoose.connect(config.mongoDB.url)

// Escuchar eventos de conexión y error
mongoose.connection.on('error', err => {
    console.error('MongoDB Connection Error:', err);
  });
  
mongoose.connection.once('open', () => {
    console.log('MongoDB connection opened successfully');
  });

const PORT = config.port;
// Iniciar el servidor con Socket.IO
server.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}`);
});

export default app;
export { io };

