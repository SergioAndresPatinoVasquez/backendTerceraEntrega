//import {Carts} from '../dao/factory.js';
import { cartsModel } from '../dao/mongo/models/carts.model.js';
import { productsModel } from '../dao/mongo/models/products.model.js';
import CartsRepository from "../repositories/carts.repository.js"


//const cartsManager = new Carts();
const cartsRepository = new CartsRepository();

const productsView = async (page, limit) => {

        const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate({}, {page, limit, lean:true});
        return {docs, hasPrevPage, hasNextPage, nextPage, prevPage};

}

const cartsView = async () => {

        const carts = await cartsRepository.get();
        return carts;
}

const cartsIdView = async  (cartId) =>{
        const cart = await cartsModel.findById(cartId).lean();
        return cart;

}

export {
    cartsView,
    cartsIdView,
    productsView

}