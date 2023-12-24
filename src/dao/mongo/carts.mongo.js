import {cartsModel} from './models/carts.model.js';
import Products from './products.mongo.js';

const allProducts = new Products();

export default class Carts {
    constructor(){
        console.log("Trabajando los carritos con DB")
    }

    get = async () =>{ //getAll
        const carts = await cartsModel.find().lean();
        return carts;

    }

    create = async () => { //save
        const result = await cartsModel.create({});
        return result; 

    }


    update = async (id, cart) =>{
        const result = await cartsModel.updateOne({_id: id}, cart);
        return result;
    };


    updateProductsInCart = async (carritoId) =>{
        
        //buscar el carrito por su id
        const carrito = await cartsModel.findById(carritoId);
        return carrito;
    }

    updateQuantityProductInCar = async(cartId) =>{
        //busco el carrito por id
        const carrito = await cartsModel.findById(cartId);
        return carrito;

    }

    deleteProductInCart = async (cid) =>{
        //busco el carrito
        const carrito = await cartsModel.findById(cid);
        return carrito;

    }


    getCartsById = async (Cartid)=>{

            const carrito = await cartsModel.findById(Cartid);            
            return carrito;
 
    }


    addProductInCart = async (cartId) =>{//addProductInCart = async (cartId, productId) 

        //encontrando el carrito por ID
        const carrito = await cartsModel.findById(cartId);
        return carrito;

    }

    deleteProduct = async(cid,pid)=>{
        const result = await cartsModel.updateOne({_id:cid},{$pull:{products:{product:pid}}})
        console.log("resultado carro", result)
        return result;
    }
}


