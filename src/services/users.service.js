//import { Users } from '../dao/factory.js';
import { createHash } from "../utils.js";
import UsersRepository from "../repositories/users.repository.js";

//const usersManager = new Users();
const usersRepository = new UsersRepository();


const getByemailLogin = async (email) =>{

    const result = await usersRepository.getByemail(email);
    return result;

}

const getByemailRegister = async (email) =>{

    const existsUser = await usersRepository.getByemail(email);
    return existsUser;


}

const saveServices = async (first_name, last_name, email, age, role, password) =>{

    const hashedPassword = createHash(password);
        
    const newUser = {
        first_name,
        last_name,
        email,
        age,
        role,
        password: hashedPassword,
    };

    const result = await usersRepository.create(newUser);
    return result;

}


export {
    getByemailLogin,
    getByemailRegister,
    saveServices
}