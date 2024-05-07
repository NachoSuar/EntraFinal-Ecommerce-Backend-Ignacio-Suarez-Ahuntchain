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

    static async getUserByID(id){
        return await Users.findOne({_id:id},{first_name:1, last_name:1, age:1, email:1, role:1}).lean();
    }

    static async updateRole(id, newRole) {
        try {
            console.log('Updating role for user with ID:', id);
            console.log('New role:', newRole);
            
            const updatedUser = await Users.findOneAndUpdate({ _id: id }, { role: newRole }, { new: true });
            console.log('User updated successfully:', updatedUser);
            
            return updatedUser;
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    }
    
    
}

export default UsersDAO;
