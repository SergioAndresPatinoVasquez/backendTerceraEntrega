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




}