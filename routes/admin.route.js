import { Router } from "express";
import express from "express";
import UsersDAO from "../dao/users.dao.js";
import { checkAdmin } from "../utils/permissions.middleware.js";

const router = Router();

// Middleware para parsear JSON
router.use(express.json());

// Middleware para parsear URL-encoded bodies
router.use(express.urlencoded({ extended: true }));

// Ruta para modificar el rol del usuario a "user"
router.post('/:id/changeRoleToUser', (req, res, next) => {
    const userId = req.params.id;
    console.log('ID del usuario recibido en la solicitud:', userId);
    next();
}, async (req, res) => {
    const userId = req.params.id;

    try {
        const updatedUser = await UsersDAO.changeUserRoleToUser(userId);
        console.log('Usuario actualizado:', updatedUser);
        res.redirect('/admin/admin');
    } catch (error) {
        console.error('Error al cambiar el rol del usuario a "user":', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para modificar el rol del usuario a "user" desde perfil
router.post('/:id/changeRoleToUserPerf', (req, res, next) => {
    const userId = req.params.id;
    console.log('ID del usuario recibido en la solicitud:', userId);
    next();
}, async (req, res) => {
    const userId = req.params.id;

    try {
        const updatedUser = await UsersDAO.changeUserRoleToUser(userId);
        console.log('Usuario actualizado:', updatedUser);
        res.redirect('/profile');
    } catch (error) {
        console.error('Error al cambiar el rol del usuario a "user":', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para modificar el rol del usuario a "premium" desde perfil
router.post('/:id/changeRoleToPremiumPerf', (req, res, next) => {
    const userId = req.params.id;
    console.log('ID del usuario recibido en la solicitud:', userId);
    next();
}, async (req, res) => {
    const userId = req.params.id;

    try {
        const updatedUser = await UsersDAO.changeUserRoleToPremium(userId);
        console.log('Usuario actualizado:', updatedUser);
        res.redirect('/profile');
    } catch (error) {
        console.error('Error al cambiar el rol del usuario a "premium":', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para modificar el rol del usuario a "premium"
router.post('/:id/changeRoleToPremium', (req, res, next) => {
    const userId = req.params.id;
    console.log('ID del usuario recibido en la solicitud:', userId);
    next();
}, async (req, res) => {
    const userId = req.params.id;

    try {
        const updatedUser = await UsersDAO.changeUserRoleToPremium(userId);
        console.log('Usuario actualizado:', updatedUser);
        res.redirect('/admin/admin');
    } catch (error) {
        console.error('Error al cambiar el rol del usuario a "premium":', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para modificar el rol del usuario a "admin"
router.post('/:id/changeRoleToAdmin', (req, res, next) => {
    const userId = req.params.id;
    console.log('ID del usuario recibido en la solicitud:', userId);
    next();
}, async (req, res) => {
    const userId = req.params.id;

    try {
        const updatedUser = await UsersDAO.changeUserRoleToAdmin(userId);
        console.log('Usuario actualizado:', updatedUser);
        res.redirect('/admin/admin');
    } catch (error) {
        console.error('Error al cambiar el rol del usuario a "admin":', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// //pato (Este es un ejemplo divertido que use para testear el funcionamiento)
// router.post('/:id/changeRoleToPato', (req, res, next) => {
//     const userId = req.params.id;
//     console.log('ID del usuario recibido en la solicitud:', userId);
//     next();
// }, async (req, res) => {
//     const userId = req.params.id;

//     try {
//         const updatedUser = await UsersDAO.changeUserRoleToPato(userId);
//         console.log('Usuario actualizado:', updatedUser);
//         res.status(200).json(updatedUser);
//     } catch (error) {
//         console.error('Error al cambiar el rol del usuario a "pato":', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });


// Ruta para eliminar un usuario
router.post('/:id/delete', async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await UsersDAO.deleteUserById(userId);
        console.log('Usuario eliminado:', deletedUser);
        res.redirect('/admin/admin'); // Redirecciona después de la eliminación
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;