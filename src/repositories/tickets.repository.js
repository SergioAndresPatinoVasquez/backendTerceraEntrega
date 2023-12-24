import { Tickets } from "../dao/factory.js";

export default class TicketRepository {
    constructor(){
        this.dao = new Tickets();
    }

    save = async(ticket) =>{
        const result = await this.dao.save(ticket);
        return result;
    }
}