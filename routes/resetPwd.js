import { Router } from "express";
import nodemailer from 'nodemailer';
import CryptoJS from 'crypto-js';
import UsersDAO from "../dao/users.dao.js";
import config from "../config/config.js";

const router = Router();

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "epcilon.resetpwd@gmail.com",
      pass: config.gmail.gmailpass,
    },
});

transporter.verify().then(() => {
    console.log('Listo para enviar correo');
}).catch(error => {
    console.error('Error al verificar el transporte de correo:', error);
});

async function enviarCorreo(destinatario, link) {
    try {
        await transporter.sendMail({
            from: '"Forgot password" <epcilon.resetpwd@gmail.com>',
            to: destinatario,
            subject: "Forgot Contraseña",
            html: `
            <b> Recuperar contraseña </b>
            <a href="${link}">${link}</a>`,
        });
        console.log('Correo electrónico enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
    }
};

router.get("/forgot-password", (req, res) => {
    console.log("Renderizando el formulario de restablecimiento de contraseña...");
    res.render("reset-password");
});

router.get("/recoverPwd", (req, res) => {
    console.log("Renderizando la página de confirmación de correo electrónico enviado...");
    res.render("forgot-password"); // Renderizar la página de confirmación de correo electrónico enviado
});

router.post("/recoverPwd", async (req, res) => {
    try {
        console.log("Iniciando solicitud de restablecimiento de contraseña...");

        // Obtener el ID de usuario enviado desde el formulario
        const userID = req.body.userID;
        console.log("ID de usuario obtenido:", userID);

        // Verificar si el usuario existe en la base de datos
        const usuario = await UsersDAO.getUserByID(userID);
        if (!usuario) {
            console.log("El usuario no está registrado");
            return res.status(404).send("El usuario no está registrado");
        }
        console.log("Usuario encontrado en la base de datos:", usuario);

        // Generar un token único para el restablecimiento de contraseña
        const token = CryptoJS.AES.encrypt(userID, 'clave_secreta').toString();
        console.log("Token generado:", token);

        // Enviar el correo electrónico con el enlace de restablecimiento de contraseña
        const link = `http://localhost:3000/resetPwd?token=${encodeURIComponent(token)}`;
        console.log("Enviando correo electrónico...");
        enviarCorreo(usuario.email, link);

        // Redireccionar al usuario a la página de confirmación
        console.log("Redireccionando a la página de confirmación...");
        res.redirect(`/resetPwd?email=${encodeURIComponent(usuario.email)}`);
    } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        res.status(500).send("Error al solicitar restablecimiento de contraseña");
    }
});


router.get("/resetPwd", (req, res) => {
    console.log("Mostrando página de confirmación...");
    const email = req.query.email;
    if (!email) {
        console.log("Falta el correo electrónico en la solicitud");
        return res.status(400).send("Falta el correo electrónico en la solicitud");
    }
    console.log("Correo electrónico recibido:", email);
    res.render('forgot-password', { email });
});

export default router;
