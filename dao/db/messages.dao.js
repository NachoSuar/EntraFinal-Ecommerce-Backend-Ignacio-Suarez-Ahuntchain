// messages.dao.js
let messages = [];

class MessagesDAO {
    static getAll() {
        return messages;
    }

    static add(user, content) {
        const message = { user, content };
        messages.push(message);
        return message;
    }
}

export default MessagesDAO;

