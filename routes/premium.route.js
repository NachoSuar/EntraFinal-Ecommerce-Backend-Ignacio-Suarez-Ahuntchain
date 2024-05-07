import express from 'express';
import UsersDAO from '../dao/users.dao.js';

const router = express.Router();

// // Ruta para cambiar el rol de un usuario a premium o viceversa
// router.put('/premium/:uid', async (req, res) => {
//     const userId = req.params.uid;

//     try {
//         // Obtener el usuario de la base de datos
//         const user = await UsersDAO.getUserByID(userId);

//         // Verificar si el usuario existe
//         if (!user) {
//             return res.status(404).send('Usuario no encontrado');
//         }

//         // Verificar el rol actual del usuario
//         if (user.role === 'user') {
//             // Cambiar el rol a premium
//             await UsersDAO.updateRole(userId, 'premium');
//             return res.status(200).send('Rol cambiado a premium');
//         } else if (user.role === 'premium') {
//             // Cambiar el rol a usuario normal
//             await UsersDAO.updateRole(userId, 'user');
//             return res.status(200).send('Rol cambiado a usuario normal');
//         } else {
//             // Si el rol actual no es válido, devolver un error
//             return res.status(400).send('Rol de usuario no válido');
//         }
//     } catch (error) {
//         console.error('Error al cambiar el rol del usuario:', error);
//         res.status(500).send('Error interno del servidor');
//     }
// });


// Ruta para cambiar el rol de un usuario de "user" a "premium"
router.put('/premium/:uid', async (req, res) => {
    const userId = req.params.uid;

    try {
        // Obtener el usuario de la base de datos
        const user = await UsersDAO.getUserByID(userId);

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Verificar el rol actual del usuario
        if (user.role === 'user') {
            // Cambiar el rol a premium
            await UsersDAO.updateRole(userId, 'premium');
            return res.status(200).send('Rol cambiado a premium');
        } else {
            // Si el rol actual no es "user", devolver un error
            return res.status(400).send('Rol de usuario no válido para cambiar a premium');
        }
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});


export default router;