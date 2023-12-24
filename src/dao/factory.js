import config from '../config/config.js';

const persistence = config.persistence;
let Users, Products, Carts, Tickets;


switch(persistence){
    case 'MONGO':
        console.log("Trabajando con BDD")
        //imports dinámicos
        const mongoose = await import ('mongoose');
        await mongoose.connect(config.mongoUrl);
        const { default: UsersMongo} = await import('./mongo/users.mongo.js');
        Users = UsersMongo;
        const { default: ProductsMongo} = await import('./mongo/products.mongo.js');
        Products = ProductsMongo;
        const { default: CartsMongo} = await import('./mongo/carts.mongo.js');
        Carts = CartsMongo;
        const { default: TicketsMongo} = await import('./mongo/tickets.mongo.js');
        Tickets = TicketsMongo;
        break;
    case 'FILES':
        console.log("Trabajando con archivos")
        const { default: CartsFiles} = await import('./fileS/carts.files.js');
        Carts = CartsFiles;
        const { default: ProductFiles} = await import('./fileS/product.files.js');
        Products = ProductFiles;
        const { default: UsersFiles} = await import('./fileS/users.files.js');
        Users = UsersFiles;
        const { default: TicketsFiles} = await import('./fileS/tickets.files.js');
        Tickets = TicketsFiles;
        break
}

export {
    Users,
    Products,
    Carts,
    Tickets
}