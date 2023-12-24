import { ticketsModel } from "./models/tickets.model.js"


export default class Ticket{
    constructor(){
        console.log('Working tickets with DB')
    }

    save = async (ticket) => {
        return await ticketsModel.create(ticket)
    }
}