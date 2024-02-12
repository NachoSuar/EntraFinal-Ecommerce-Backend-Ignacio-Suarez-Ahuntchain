import Message from "../models/message.schema.js";

class MessagesDAO {
    static async getAll() {
        try {
            return await Message.find().lean();
        } catch (error) {
            console.error("Error en getAll (messages):", error);
            throw error;
        }
    }

    static async add(messageData) {
        try {
            return await new Message(messageData).save();
        } catch (error) {
            console.error("Error en add (messages):", error);
            throw error;
        }
    }
}

export default MessagesDAO;
