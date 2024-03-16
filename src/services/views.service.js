//import {Carts} from '../dao/factory.js';
import {
        cartsModel
} from '../dao/mongo/models/carts.model.js';
import {
        productsModel
} from '../dao/mongo/models/products.model.js';
import usersModel from '../dao/mongo/models/users.model.js';
import CartsRepository from "../repositories/carts.repository.js";



//const cartsManager = new Carts();
const cartsRepository = new CartsRepository();

const productsView = async (page, limit) => {

        const {
                docs,
                hasPrevPage,
                hasNextPage,
                nextPage,
                prevPage
        } = await productsModel.paginate({}, {
                page,
                limit,
                lean: true
        });
        return {
                docs,
                hasPrevPage,
                hasNextPage,
                nextPage,
                prevPage
        };

}

const cartsView = async () => {

        const carts = await cartsRepository.get();
        return carts;
}

const cartsIdView = async (cartId) => {
        const cart = await cartsModel.findById(cartId).lean();
        return cart;

}

const getUserCarts = async (userId) => {
        try {
                // Obtener el usuario con los carritos
                const user = await usersModel
                        .findById(userId)
                        .populate('cartId.cart');

                // Extraer los carritos del usuario
                const carts = user.cartId;

                // Obtener los productos para cada carrito
                const cartsWithProducts = await Promise.all(carts.map(async (cart) => {
                        try {
                                // Obtener el carrito de la base de datos
                                const cartFromDB = await cartsModel
                                        .findById(cart.cart._id);

                                console.log('Carrito de la base de datos:', cartFromDB);

                                // Obtener los detalles de los productos del carrito
                                const productsWithDetails = await Promise.all(cartFromDB.products.map(async (product) => {
                                        try {
                                                const productDetails = await productsModel
                                                        .findById(product.product)
                                                        .select('title description price');

                                                console.log('Detalles del producto:', productDetails);

                                                return {
                                                        _id: productDetails._id,
                                                        title: productDetails.title,
                                                        description: productDetails.description,
                                                        price: productDetails.price,
                                                        quantity: product.quantity,
                                                };
                                        } catch (error) {
                                                console.error('Error obteniendo detalles del producto:', error.message);
                                                throw new Error('Error en getUserCarts - Detalles del producto');
                                        }
                                }));

                                return {
                                        _id: cartFromDB._id,
                                        products: productsWithDetails,
                                        total: productsWithDetails.reduce((total, product) => total + product.quantity * product.price, 0),
                                };
                        } catch (error) {
                                console.error('Error obteniendo detalles del carrito:', error.message);
                                throw new Error('Error en getUserCarts - Detalles del carrito');
                        }
                }));

                console.log('Carritos obtenidos con productos:', cartsWithProducts);
                return cartsWithProducts;
        } catch (error) {
                console.error('Error en getUserCarts:', error.message);
                throw new Error('Error en getUserCarts');
        }
};




export {
        cartsView,
        cartsIdView,
        productsView,
        getUserCarts

}