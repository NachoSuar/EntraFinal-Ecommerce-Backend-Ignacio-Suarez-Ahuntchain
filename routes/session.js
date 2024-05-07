import { Router } from "express";
import UsersDAO from "../dao/users.dao.js";
import { createHash, isValidPassword } from "../utils/crypt.js";
import passport from "passport";
import viewRouter from "./views.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = Router()

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

