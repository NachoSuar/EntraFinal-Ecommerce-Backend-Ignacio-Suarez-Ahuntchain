import express from "express";
import { engine } from 'express-handlebars';
import mongoose from "mongoose";
import http from 'http';
import { Server } from 'socket.io'; 
import cartsRouter from "./routes/carts.route.js";
import Cart from './dao/models/cart.schema.js';
import prodsRouter from './routes/products.route.js';
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import sessionsRouter from './routes/session.js';

// Función para validar ObjectId
function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server); 


// View engine
app.engine('handlebars', engine());
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
        mongoUrl:"mongodb://127.0.0.1:27017/epcilon",
        ttl: 240,
    }),
    secret:"secretCode",
    resave: true,
    saveUninitialized: true
}));

app.use("/api/sessions", sessionsRouter);
app.use("/", viewRouter);






// Router productos
app.use("/products", prodsRouter);

// Router Carts
app.use("/carts", cartsRouter);

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


// modelo del carrito
app.get('/mostrar_carrito', async (req, res) => {
    try {
      const carrito = await Cart.findOne({ /* condiciones de búsqueda */ });
      res.json(carrito);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el carrito');
    }
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
mongoose.connect("mongodb://127.0.0.1:27017/epcilon");

mongoose.connection.on('error', err => {
    console.error('MongoDB Connection Error:', err);
});

app.listen(3000, () => {
    console.log("App listening on port 3000");
});

export { io };