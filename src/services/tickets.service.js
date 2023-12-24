import TicketRepository from "../repositories/tickets.repository.js"
import {v4 as uuidv4} from 'uuid';

const ticketRepository = new TicketRepository()

const generatePurchase = async (user, amount) => {
    const newTicket = {
        code: uuidv4(),
        purchase_datetime: new Date().toLocaleString(),
        amount,
        purchaser: user.email
    }

    //usar el ticketrepository para guardar el ticket generado
    await ticketRepository.save(newTicket);

    return newTicket;
}

export {
    generatePurchase
}