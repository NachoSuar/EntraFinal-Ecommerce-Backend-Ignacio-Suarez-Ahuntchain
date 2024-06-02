import Users from "./models/users.schema.js";

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

    // Método para actualizar el rol del usuario
    static async updateRole(userId, newRole) {
        try {
            console.log(`Actualizando rol del usuario ${userId} a ${newRole}`);
            // Actualizar el rol del usuario en la base de datos
            await Users.findByIdAndUpdate(userId, { role: newRole });

            // Mensaje de registro para verificar que se actualizó el rol correctamente
            console.log(`Rol del usuario ${userId} actualizado a ${newRole}`);

            // No es necesario devolver ningún valor, ya que la actualización se realizó con éxito
        } catch (error) {
            console.error('Error al actualizar el rol del usuario:', error);
            throw error;
        }
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
}

export default UsersDAO;
