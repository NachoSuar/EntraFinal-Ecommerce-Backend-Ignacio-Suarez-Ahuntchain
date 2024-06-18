import Users from "./models/users.schema.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/email.js";

class UsersDAO {
    static async getUserByEmail(email){
        return await Users.findOne({email});
    }

    static async getUserByResetToken(token) {
        return await Users.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    }

    static async insert(first_name, last_name, age, email, password){
        return await new Users({first_name, last_name, age, email, password}).save();
    }

    static async getUserByID(id) {
        return await Users.findOne({_id:id},{first_name:1, last_name:1, age:1, email:1, role:1}).lean();
    }
    
    static async updateUserDocuments(id, documents) {
        return await Users.updateOne({ _id: id }, { $push: { documents: { $each: documents } } });
    }

    


    // Método para actualizar la última conexión del usuario
    static async updateLastConnection(userId) {
        try {
            console.log(`Actualizando last_connection del usuario ${userId}`);
            // Actualizar la propiedad last_connection del usuario en la base de datos
            await Users.findByIdAndUpdate(userId, { last_connection: new Date() });
            console.log(`Last_connection del usuario ${userId} actualizado`);
        } catch (error) {
            console.error('Error al actualizar last_connection:', error);
            throw error;
        }
    }

    //Cambiar Rol a User
    static async changeUserRoleToUser(userId) {
        try {
            console.log(`Verificando ID: ${userId}`); // Log de verificación

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.error(`ID inválido: ${userId}`);
                throw new Error('El ID de usuario proporcionado no es válido');
            }

            console.log(`Buscando usuario por ID: ${userId}`); // Log de verificación
            const user = await Users.findById(userId);

            if (!user) {
                console.error(`Usuario no encontrado con ID: ${userId}`);
                throw new Error('No se encontró al usuario');
            }

            console.log(`Usuario encontrado: ${user}`); // Log de verificación
            user.role = "user";
            await user.save();

            console.log(`Rol del usuario actualizado: ${user.role}`); // Log de verificación
            return user;
        } catch (error) {
            console.error('Error al cambiar el role del usuario a "user":', error);
            throw error;
        }
    }
   
    //Cambiar Rol a Premium
    static async changeUserRoleToPremium(userId) {
        try {
            console.log(`Verificando ID: ${userId}`); // Log de verificación

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.error(`ID inválido: ${userId}`);
                throw new Error('El ID de usuario proporcionado no es válido');
            }

            console.log(`Buscando usuario por ID: ${userId}`); // Log de verificación
            const user = await Users.findById(userId);

            if (!user) {
                console.error(`Usuario no encontrado con ID: ${userId}`);
                throw new Error('No se encontró al usuario');
            }

            console.log(`Usuario encontrado: ${user}`); // Log de verificación
            user.role = "premium";
            await user.save();

            console.log(`Rol del usuario actualizado: ${user.role}`); // Log de verificación
            return user;
        } catch (error) {
            console.error('Error al cambiar el role del usuario a "premium":', error);
            throw error;
        }
    }

    //Cambiar rol a Admin
    static async changeUserRoleToAdmin(userId) {
        try {
            console.log(`Verificando ID: ${userId}`); // Log de verificación

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.error(`ID inválido: ${userId}`);
                throw new Error('El ID de usuario proporcionado no es válido');
            }

            console.log(`Buscando usuario por ID: ${userId}`); // Log de verificación
            const user = await Users.findById(userId);

            if (!user) {
                console.error(`Usuario no encontrado con ID: ${userId}`);
                throw new Error('No se encontró al usuario');
            }

            console.log(`Usuario encontrado: ${user}`); // Log de verificación
            user.role = "admin";
            await user.save();

            console.log(`Rol del usuario actualizado: ${user.role}`); // Log de verificación
            return user;
        } catch (error) {
            console.error('Error al cambiar el role del usuario a "premium":', error);
            throw error;
        }
    }

    // (Este es un ejemplo divertido que use para testear el funcionamiento)
    // static async changeUserRoleToPato(userId) {
    //     try {
    //         console.log(`Verificando ID: ${userId}`); // Log de verificación

    //         if (!mongoose.Types.ObjectId.isValid(userId)) {
    //             console.error(`ID inválido: ${userId}`);
    //             throw new Error('El ID de usuario proporcionado no es válido');
    //         }

    //         console.log(`Buscando usuario por ID: ${userId}`); // Log de verificación
    //         const user = await Users.findById(userId);

    //         if (!user) {
    //             console.error(`Usuario no encontrado con ID: ${userId}`);
    //             throw new Error('No se encontró al usuario');
    //         }

    //         console.log(`Usuario encontrado: ${user}`); // Log de verificación
    //         user.role = "pato";
    //         await user.save();

    //         console.log(`Rol del usuario actualizado: ${user.role}`); // Log de verificación
    //         return user;
    //     } catch (error) {
    //         console.error('Error al cambiar el role del usuario a "pato":', error);
    //         throw error;
    //     }
    // }

    // Método para obtener todos los usuarios con solo los datos principales
    static async getAllUsers() {
        try {
            return await Users.find({}, { first_name: 1, last_name: 1, email: 1, role: 1 }).lean();
        } catch (error) {
            throw new Error(`Error al obtener todos los usuarios: ${error.message}`);
        }
    }

     // Función para eliminar un usuario por ID
    static async deleteUserById(userId) {
        try {
            console.log(`Verificando ID: ${userId}`); // Log de verificación

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.error(`ID inválido: ${userId}`);
                throw new Error('El ID de usuario proporcionado no es válido');
            }

            console.log(`Buscando usuario por ID: ${userId}`); // Log de verificación
            const user = await Users.findByIdAndDelete(userId);

            if (!user) {
                console.error(`Usuario no encontrado con ID: ${userId}`);
                throw new Error('No se encontró al usuario');
            }

            console.log(`Usuario eliminado: ${user}`); // Log de verificación

            // Enviar correo electrónico al usuario eliminado
            try {
                await sendEmail(user.email, 'Tu cuenta ha sido eliminada', 'Lo sentimos, tu cuenta ha sido eliminada.');
                console.log(`Email enviado a ${user.email}`);
            } catch (error) {
                console.error(`Error al enviar el correo electrónico a ${user.email}:`, error);
            }

            return user;
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            throw error;
        }
    }

    // Método para eliminar usuarios inactivos y enviar correos electrónicos
    static async deleteInactiveUsers() {
        try {
            const inactiveDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Hace 2 días
            console.log(`Fecha límite para usuarios inactivos: ${inactiveDate}`);

            const deletedUsers = await Users.find({ last_connection: { $lt: inactiveDate } });
            console.log(`Usuarios inactivos encontrados: ${deletedUsers.length}`);

            if (deletedUsers.length > 0) {
                await Users.deleteMany({ last_connection: { $lt: inactiveDate } });
                console.log(`Usuarios eliminados: ${deletedUsers.length}`);

                for (const user of deletedUsers) {
                    try {
                        await sendEmail(user.email, 'Tu cuenta ha sido eliminada por inactividad', 'Lo sentimos, tu cuenta ha sido eliminada por inactividad.');
                        console.log(`Email enviado a ${user.email}`);
                    } catch (error) {
                        console.error(`Error al enviar el correo electrónico a ${user.email}:`, error);
                    }
                }

                return { message: `Se eliminaron ${deletedUsers.length} usuarios por inactividad.` };
            } else {
                return { message: "No se encontraron usuarios inactivos para eliminar." };
            }
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos:', error);
            throw error;
        }
    }
}

export default UsersDAO;

