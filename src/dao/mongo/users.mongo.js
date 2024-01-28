import usersModel from "./models/users.model.js"

export default class Users {
    constructor(){
        console.log('Working users with DB')
    }

    getByemail = async(email) =>{
        const user = await usersModel.findOne({email}).lean();
        return user;
    }

    getByUserId = async (userId) => {
        const user = await usersModel.findOne({ _id: userId });
        return user;
    }

    create = async(user) => {
        const result = await usersModel.create(user);
        return result;
    }

    updatePassword = async (userId, hashedPassword) => {
        // Implementa la lógica para actualizar la contraseña en la base de datos
        await usersModel.updateOne({ _id: userId }, { password: hashedPassword });

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



    
}