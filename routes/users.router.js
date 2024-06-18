import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import UsersDAO from "../dao/users.dao.js";
import { checkAdmin } from "../utils/permissions.middleware.js";

const router = Router();

// Función para asegurar que las carpetas existen
const ensureUploadsFoldersExist = () => {
    const folders = ['uploads/profiles', 'uploads/documents', 'uploads/others'];
    folders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    });
};

// Llamada para crear las carpetas si no existen
ensureUploadsFoldersExist();

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'profile' && file.mimetype.startsWith('image/')) {
            cb(null, 'uploads/profiles/');
        } else if (file.fieldname === 'document' && file.mimetype === 'application/pdf') {
            cb(null, 'uploads/documents/');
        } else {
            cb(null, 'uploads/others/');
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limitar el tamaño de los archivos a 10MB
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'profile' && file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else if (file.fieldname === 'document' && file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
        }
    }
}).fields([
    { name: 'profile', maxCount: 1 },
    { name: 'document', maxCount: 10 }
]);

router.post("/:uid/documents", upload, async (req, res) => {
    const userId = req.params.uid;

    try {
        const user = await UsersDAO.getUserByID(userId);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        const documents = [];

        if (req.files['profile']) {
            req.files['profile'].forEach(file => {
                documents.push({
                    name: file.originalname,
                    reference: file.path,
                });
            });
        }

        if (req.files['document']) {
            req.files['document'].forEach(file => {
                documents.push({
                    name: file.originalname,
                    reference: file.path,
                });
            });
        }

        await UsersDAO.updateUserDocuments(userId, documents);

        res.status(200).send('Documentos subidos exitosamente');
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/premium/:uid', async (req, res) => {
    const userId = req.params.uid;

    // Agregar console.log para depurar
    console.log("Llegó a la ruta '/premium/:uid'");
    console.log("User ID:", userId);

    try {
        // Obtener el usuario de la base de datos
        const user = await UsersDAO.getUserByID(userId);

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Verificar el rol actual del usuario
        if (user.role === 'user') {
            // Actualizar el rol del usuario a "premium"
            await UsersDAO.updateRole(userId, 'premium');
            
            // Agregar console.log para depurar
            console.log("El rol del usuario es 'user'. Actualizando a 'premium'.");
            
            // Redirigir al perfil después de actualizar el rol a premium
            return res.redirect("/profile");
        } else {
            return res.status(400).send('El rol del usuario no es válido para cambiar a premium');
        }        
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/revert-premium/:uid', async (req, res) => {
    const userId = req.params.uid;

    try {
        const user = await UsersDAO.getUserByID(userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        if (user.role === 'premium') {
            await UsersDAO.updateRole(userId, 'user');
            return res.redirect("/profile");
        } else {
            return res.status(400).send('El usuario no es premium');
        }
    } catch (error) {
        console.error('Error al revertir el rol del usuario a user:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Obtener todos los usuarios
router.get("/userslist", checkAdmin, async (req, res) => {
    try {
        const users = await UsersDAO.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Eliminar usuarios inactivos
router.delete("/inactiveUsers", checkAdmin, async (req, res) => {
    try {
        console.log("Solicitud para eliminar usuarios inactivos recibida");
        const result = await UsersDAO.deleteInactiveUsers();
        console.log('Eliminación cumplida:', result);
        res.status(200).json(result); // Cambiar a JSON para que el cliente pueda manejar la respuesta
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

export default router;
