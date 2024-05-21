import { Router } from "express";
import UsersDAO from "../dao/users.dao.js";

const router = Router()

router.get('/', (req, res) => {
    res.redirect('/home');
});

function middleware_auth(req, res, next){
    if(req.session.user){
        next()
    } else {
        res.redirect("/login");
    }
};

// router.get('/home', (req, res) => {

//     if(req.session.user){
//         res.redirect("/products");
//     } else {
//         res.render("home");
//     }

// });

router.get('/register', (req, res) => {
    res.render("register");
});

router.get('/login', (req, res) => {

    if(req.session.user){
        res.redirect("/profile");
    } else {
        res.render("login");
    }

});

router.get('/profile', middleware_auth, async (req, res) => {
    try {
        const userId = req.session.user;
        const user = await UsersDAO.getUserByID(userId);
        res.render('profile', { user }); // Pasar el objeto de usuario a la plantilla
    } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
        res.status(500).send('Error interno del servidor');
    }
});


router.get("/ejemplo", (req, res) => {
    console.log("Renderizando el formulario de restablecimiento de contraseña...");
    res.render("test2"); // Renderizar el formulario de restablecimiento de contraseña
});

router.get("/prueba", (req, res) => {
    console.log("Renderizando el formulario de restablecimiento de contraseña...");
    res.render("test"); // Renderizar el formulario de restablecimiento de contraseña
});

export default router;