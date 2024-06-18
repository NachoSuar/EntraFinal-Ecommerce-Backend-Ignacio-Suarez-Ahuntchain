// Importa los módulos necesarios y configura tus rutas como corresponda
import UsersDAO from '../dao/users.dao.js'; // Ajusta la ruta según tu estructura
import customizeError from '../errorCustom/errorCustom.js'; // Ajusta la ruta según tu estructura

// Middleware para verificar si el usuario es administrador
export const checkAdmin = async (req, res, next) => {
    console.log('Middleware checkAdmin ejecutándose');
    
    try {
        const userId = req.session.user;
        if (!userId) {
            console.log('Usuario no autenticado');
            return res.status(401).send('Solo Administrador');
        }

        const user = await UsersDAO.getUserByID(userId);
        if (!user || user.role !== 'admin') {
            console.log('Usuario no autorizado');
            return res.status(403).send('Solo Administrador');
        }

        req.user = user; // Asigna el usuario a req.user
        console.log('Usuario autenticado y es admin');
        next();
    } catch (error) {
        console.error('Error en middleware checkAdmin:', error);
        res.status(500).send('SERVER_ERROR');
    }
};

// Middleware para verificar si el usuario es usuario normal
export const checkUser = async (req, res, next) => {
    console.log('Middleware checkUser ejecutándose');
    
    try {
        const userId = req.session.user;
        if (!userId) {
            console.log('Usuario no autenticado');
            return res.status(401).send('Requiere Usuario');
        }

        const user = await UsersDAO.getUserByID(userId);
        if (!user || user.role !== 'user') {
            console.log('Usuario no autorizado');
            return res.status(403).send(customizeError('Requiere Usuario'));
        }

        req.user = user; // Asigna el usuario a req.user
        console.log('Usuario autenticado y es user');
        next();
    } catch (error) {
        console.error('Error en middleware checkUser:', error);
        res.status(500).send('SERVER_ERROR');
    }
};

// Middleware para verificar si el usuario es premium
export const checkUserPremiun = async (req, res, next) => {
    console.log('Middleware checkUserPremiun ejecutándose');
    
    try {
        const userId = req.session.user;
        if (!userId) {
            console.log('Usuario no autenticado');
            return res.status(401).send('Requiere Premium');
        }

        const user = await UsersDAO.getUserByID(userId);
        if (!user || user.role !== 'premium') {
            console.log('Usuario no autorizado');
            return res.status(403).send(customizeError('Requiere Premium'));
        }

        req.user = user; // Asigna el usuario a req.user
        console.log('Usuario autenticado y es premium');
        next();
    } catch (error) {
        console.error('Error en middleware checkUserPremiun:', error);
        res.status(500).send('SERVER_ERROR');
    }
};
