// import mongoose from "mongoose";
// import { assert } from "chai";
// import { describe, it, before } from "mocha";
// import UsersDAO from "../dao/users.dao.js"; // Asegúrate de que la ruta sea correcta
// import config from "../config/config.js";

// mongoose.connect(config.mongoDB.url);

// describe('testing users dao', () =>{
//     before(function () {
//         this.UsersDAO = new UsersDAO();
//     });
//     it('debería poder obtener un usuario por correo electrónico', async function(){
//         const email = "Ejemplo@gmail.com"; 
//         const user = await this.UsersDAO.getUserByEmail(email);
//         assert.exists(user); 
//     });
// });
