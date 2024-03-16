import usersModel from "./models/users.model.js"

export default class Users {
    constructor() {
        console.log('Working users with DB')
    }

    getByemail = async (email) => {
        const user = await usersModel.findOne({
            email
        }).lean();
        return user;
    }

    getByUserId = async (userId) => {
        const user = await usersModel.findOne({
            _id: userId
        });
        return user;
    }

    create = async (user) => {
        const result = await usersModel.create(user);
        return result;
    }

    updatePassword = async (userId, hashedPassword) => {
        // Implementa la lógica para actualizar la contraseña en la base de datos
        await usersModel.updateOne({
            _id: userId
        }, {
            password: hashedPassword
        });

        console.log('Password updated successfully');
    }


    getByUserId = async (userId) => {
        const user = await usersModel.findById(userId);
        return user;
    }

    updateUser = async (user) => {
        const updatedUser = await user.save();
        return updatedUser;
    }

    getAllUsers = async () => {
        const users = await usersModel.find(); // Excluir la contraseña
        return users;
    }

    deleteMany = async (filter) => {
        try {
            const result = await usersModel.deleteMany(filter);
            return result;
        } catch (error) {
            throw new Error(`Error in DAO deleteMany: ${error.message}`);
        }
    }

    getInactiveUsers = async (lastConnectionThreshold) => {
        try {
            console.log('Tipo de lastConnectionThreshold en getInactiveUsers:', typeof lastConnectionThreshold);
            console.log('Cadena recibida en getInactiveUsers:', lastConnectionThreshold);

            // Extrae la fecha directamente del objeto
            const lastConnectionDate = lastConnectionThreshold.last_connection.$lt;

            console.log('Valor de lastConnectionDate en getInactiveUsers:', lastConnectionDate);

            // Verifica si lastConnectionDate es un objeto Date
            if (!(lastConnectionDate instanceof Date) || isNaN(lastConnectionDate.getTime())) {
                console.error('Error en getInactiveUsers: El parámetro lastConnectionThreshold no es un objeto Date válido.');
                throw new Error('El parámetro lastConnectionThreshold no es un objeto Date válido.');
            }

            const inactiveUsers = await usersModel.find({
                last_connection: {
                    $lt: lastConnectionDate
                }
            });
            return inactiveUsers;
        } catch (error) {
            console.error(`Error in DAO getInactiveUsers: ${error.message}`);
            throw new Error(`Error in DAO getInactiveUsers: ${error.message}`);
        }
    }




    deleteInactiveUsers = async (lastConnectionThreshold) => {
        try {
            // Obtén usuarios inactivos antes de eliminarlos
            const deletedUsers = await this.getInactiveUsers(lastConnectionThreshold);

            // Elimina usuarios inactivos desde la colección
            const result = await usersModel.deleteMany({
                last_connection: {
                    $lt: lastConnectionThreshold
                }
            });

            return {
                deletedUsers,
                result
            };
        } catch (error) {
            throw new Error(`Error in DAO deleteInactiveUsers: ${error.message}`);
        }
    }




}