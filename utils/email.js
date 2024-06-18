// Importa nodemailer
import nodemailer from 'nodemailer';
import { Router } from "express";
import UsersDAO from "../dao/users.dao.js";
import config from "../config/config.js";

// Configura el transporter para enviar correos electrónicos
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Cambia esto por tu servidor SMTP
    port: 587,
    secure: false, // true para usar SSL/TLS
    auth: {
        user: 'epcilon.resetpwd@gmail.com', // Cambia esto por tu dirección de correo
        pass: config.gmail.gmailpass, // Cambia esto por tu contraseña
    },
});

// Función para enviar correos electrónicos
const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: 'epcilon.resetpwd@gmail.com',
            to,
            subject,
            text,
        });
        console.log(`Correo electrónico enviado a ${to}: ${info.messageId}`);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw error; // Lanza el error para manejarlo fuera de esta función si es necesario
    }
};

export { transporter, sendEmail };
