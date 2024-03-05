import { Router } from "express";
import UsersDAO from "../dao/users.dao.js";
import { createHash, isValidPassword } from "../utils/crypt.js";
import passport from "passport";
import viewRouter from "./views.js";

const router = Router()

// router.post("/register", async (req, res) => {

//     let first_name = req.body.first_name;
//     let last_name = req.body.last_name;
//     let email = req.body.email;
//     let age = parseInt(req.body.age);
//     let password = req.body.password;

//     if(!first_name || !last_name || !email || !age || !password ){
//         res.redirect("/register");
//     }

//     let emailUser = await UsersDAO.getUserByEmail(email);

//     if(emailUser){
//         res.redirect("/register");
//     } else {
//         await UsersDAO.insert(first_name,last_name,age,email,createHash(password));
//         res.redirect("/login");
//     }

// });

// router.post("/login", async (req, res) => {
//     let email = req.body.email;
//     let password =  req.body.password;

//     if(!email || !password){
//         res.redirect("/login");
//     }

//     let user = await UsersDAO.getUserByEmail(email);

//     if (isValidPassword(password, user?.password)){
//         console.log("Contraseña invalida");
//         res.redirect("/login");
//     } else {
//         req.session.user = user._id;
//         res.redirect("/products");
//     }
    


// });

//----------> Ejemplo de Logout que redirecciona al login <------------------
// router.get("/logout", (req, res) => {
//     req.session.destroy((err) => {
//         res.redirect("/login");
//     });
// });


router.post("/register", passport.authenticate("register", {failureRedirect:"/failregister"}), async (req,res) => {
    res.redirect("/login");
})

router.get("/failregister", (req,res) => {
    res.send({error:"Failed register"});
})

router.post("/login", passport.authenticate("login", {failureRedirect:"/faillogin"}), async (req,res) => {
    
    if(!req.user) {
        return res.redirect("/login");
    }
    req.session.user = req.user._id;
    res.redirect("/products");
});

router.get("/faillogin", (req, res) => {
    res.status(401).send({ error: "Failed login. Invalid username or password." });
});

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async (req,res) =>{});

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async (req,res) =>{
    req.session.user = req.user;
    res.redirect('/products');
});


// Logout
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/home");
    });
});

export default router;

