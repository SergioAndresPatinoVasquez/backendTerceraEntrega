//import { Users } from '../dao/factory.js';
import {
    createHash
} from "../utils.js";
import UsersRepository from "../repositories/users.repository.js";


//const usersManager = new Users();
const usersRepository = new UsersRepository();


const getByemailLogin = async (email) => {

    const result = await usersRepository.getByemail(email);
    return result;

}

const getByemailRegister = async (email) => {

    const existsUser = await usersRepository.getByemail(email);
    return existsUser;


}

const saveServices = async (first_name, last_name, email, age, role, password) => {

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

const passwordChangedService = async (email, newPassword) => {
    // Verificar si el correo electrónico existe en la base de datos
    const existingUser = await usersRepository.getByemail(email);

    if (!existingUser) {
        throw new Error('User not found in the database');
    }

    // Hacer el hash de la nueva contraseña
    const hashedPassword = createHash(newPassword);

    // Actualizar la contraseña en la base de datos
    await usersRepository.updatePassword(existingUser._id, hashedPassword);

    // Otras operaciones adicionales que puedas necesitar
};

const changeUserRoleService = async (userId) => {
    try {
        // Obtener el usuario por su ID
        const user = await usersRepository.getByUserId(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Cambiar el rol
        if (user.role === 'user' || user.role === 'USER') {
            user.role = 'premium';
        } else if (user.role === 'premium' || user.role === 'PREMIUM') {
            user.role = 'user';
        } else {
            throw new Error('Invalid role');
        }

        // Guardar el usuario actualizado en la base de datos
        const updatedUser = await usersRepository.updateUser(user);

        return {
            message: `User role changed to ${updatedUser.role}`,
            user: updatedUser
        };
    } catch (error) {
        throw new Error(`Error changing user role: ${error.message}`);
    }
};

const updateLastConnection = async (userId) => {
    try {
        const user = await usersRepository.getByUserId(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Actualiza la última conexión del usuario
        user.last_connection = new Date();

        // Guarda el usuario actualizado en la base de datos
        await usersRepository.updateUser(user);

    } catch (error) {
        throw new Error(`Error updating last connection: ${error.message}`);
    }
};

const uploadDocuments = async (userId, document, filename) => {
    try {
        const result = await usersRepository.uploadDocuments(userId, document, filename);
        return result;
    } catch (error) {
        throw new Error(`Error en el servicio de subida de documentos: ${error.message}`);
    }
};

const getAllUsersService = async () => {
    try {
        // Obtener todos los usuarios desde el repositorio
        const users = await usersRepository.getAllUsers();
        return users;
    } catch (error) {
        throw new Error(`Error en el servicio getAllUsers: ${error.message}`);
    }
}

// En la capa de servicio
const deleteInactiveUsersService = async (lastConnectionThreshold) => {
    try {
        // Verifica si lastConnectionThreshold es un objeto Date
        if (!(lastConnectionThreshold instanceof Date) || isNaN(lastConnectionThreshold.getTime())) {
            console.error('Error en deleteInactiveUsersService: El parámetro lastConnectionThreshold no es un objeto Date válido.');
            throw new Error('El parámetro lastConnectionThreshold no es un objeto Date válido.');
        }

        // Imprime la cadena recibida en la consola para depuración
        console.log('Tipo de lastConnectionThreshold:', typeof lastConnectionThreshold);
        console.log('Cadena recibida en deleteInactiveUsersService:', lastConnectionThreshold);

        const deletedUsers = await usersRepository.deleteInactiveUsers(lastConnectionThreshold);
        return deletedUsers;
    } catch (error) {
        console.error(`Error en el servicio deleteInactiveUsersService: ${error.message}`);
        throw new Error(`Error en el servicio deleteInactiveUsersService: ${error.message}`);
    }
};




export {
    getByemailLogin,
    getByemailRegister,
    saveServices,
    passwordChangedService,
    changeUserRoleService,
    updateLastConnection,
    uploadDocuments,
    getAllUsersService,
    deleteInactiveUsersService
}