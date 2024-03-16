import { Users } from '../dao/factory.js';

export default class UsersRepository {
    constructor() {
        this.dao = new Users();
    }

    getByemail = async (email) => {
        const user = await this.dao.getByemail(email)
        return user;
    }

    create = async (user) => {
        const result = await this.dao.create(user);
        return result;
    }

    updatePassword = async (userId, hashedPassword) => {
        return await this.dao.updatePassword(userId, hashedPassword);
    }


    getByUserId = async (userId) => {
        const user = await this.dao.getByUserId(userId);
        return user;
    }

    updateUser = async (user) => {
        const updatedUser = await this.dao.updateUser(user);
        return updatedUser;
    }

    uploadDocuments = async (userId, document, filename) => {
        try {
            const user = await this.dao.getByUserId(userId);
    
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
    
            // Verifica si el objeto `document` tiene un nombre
            if (!document.name) {
                return {
                    status: 'error',
                    error: 'Valores incompletos: falta el nombre del documento.'
                };
            }
    
            const thumbnail = `http://localhost:8080/img/documents/${filename}`;
    
            // Añade el documento al array 'documents' del usuario
            user.documents.push({
                name: document.name,
                reference: thumbnail
            });
    
            // Guarda el usuario actualizado en la base de datos
            await this.dao.updateUser(user);
    
            return user;
        } catch (error) {
            throw new Error(`Error en el repositorio de subida de documentos: ${error.message}`);
        }
    };

    getAllUsers = async () => {
        try {
            // Obtener todos los usuarios desde el DAO
            const users = await this.dao.getAllUsers();
    
            // // Mapear los usuarios a DTO
            // const usersDto = users.map(user => new UsersDto(user));
    
            return users;
        } catch (error) {
            throw new Error(`Error en el repositorio getAllUsers: ${error.message}`);
        }
    }


    getInactiveUsers = async (lastConnectionThreshold) => {
        try {
            // Verifica si lastConnectionThreshold es un objeto Date
            if (!(lastConnectionThreshold instanceof Date)) {
                throw new Error('El parámetro lastConnectionThreshold no es un objeto Date válido.');
            }
    
            const inactiveUsers = await this.dao.getInactiveUsers({ last_connection: { $lt: lastConnectionThreshold } });
            return inactiveUsers;
        } catch (error) {
            throw new Error(`Error in DAO getInactiveUsers: ${error.message}`);
        }
    }
    
    
    deleteInactiveUsers = async (lastConnectionThreshold) => {
        try {
            // usuarios inactivos antes de eliminarlos
            console.log('Llamando a getInactiveUsers en deleteInactiveUsers');
            const deletedUsers = await this.getInactiveUsers(lastConnectionThreshold);
    
            // Eliminar usuarios inactivos desde la colección
            const result = await this.dao.deleteMany({ last_connection: { $lt: lastConnectionThreshold } });
    
            return { deletedUsers, result };
        } catch (error) {
            console.error(`Error en repository deleteInactiveUsers: ${error.message}`);
            throw new Error(`Error in repository deleteInactiveUsers: ${error.message}`);
        }
    }
    
    
    



}