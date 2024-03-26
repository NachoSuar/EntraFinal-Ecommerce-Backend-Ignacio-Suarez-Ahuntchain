import { Strategy } from "passport-local";
import UsersDAO from "../dao/users.dao.js";
import passport from "passport";
import { createHash } from "../utils/crypt.js";
import { isValidPassword } from "../utils/crypt.js";
import GithubStrategy from 'passport-github2';
import config from "./config.js";

const initializePassport = () => {
    
    passport.use("register", new Strategy({passReqToCallback:true, usernameField:"email"}, async (req, username, password, done) =>{

        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let age = parseInt(req.body.age);
        let email = req.body.email;

        if(!first_name || !last_name || !email || !age || !password){
            return done(null, false);
        }

        let emailUser = await UsersDAO.getUserByEmail(username);

        if(emailUser){
            return done(null, false);
        } else {
            let user = await UsersDAO.insert(first_name, last_name, age, email, createHash(password));
            done(null, user);
        }

    }));

    passport.use("login", new Strategy({usernameField:"email"}, async (username, password, done)=> {

        if(!username || !password){
            return done(null,false)
        }

        let user = await UsersDAO.getUserByEmail(username);
        
        if(isValidPassword(password, user?.password)){
            return done(null, user)
        } else {
            return done(null, false);
        }
    }));

    passport.serializeUser((user, done) =>{
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) =>{
        let user = await UsersDAO.getUserByID(id);
        done(null, user);
    });

    passport.use('github', new GithubStrategy({
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: 'http://localhost:3000/api/sessions/githubcallback',
    }, async (accesstoken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await UsersDAO.getUserByEmail(profile._json.email);
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 20,
                    email: profile._json.email,
                    password: '',
                    role: '',
                    cart: null
                };
                let result = await UsersDAO.insert(newUser.first_name, newUser.last_name, newUser.age, newUser.email, newUser.password, newUser.role);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializePassport;