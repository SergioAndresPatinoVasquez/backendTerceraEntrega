import {Users} from '../dao/factory.js';

export default class UsersRepository{
    constructor(){
        this.dao = new Users();
    }

    getByemail = async(email) =>{
        const user = await this.dao.getByemail(email)
        return user;
    }

    create = async(user) => {
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

}