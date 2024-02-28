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

router.get("/profile", middleware_auth, async (req, res) => {
    let user = await UsersDAO.getUserByID(req.session.user);
    res.render("profile", { user });
});

export default router;