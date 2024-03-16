//import {Carts} from '../dao/factory.js';
import { cartsModel } from "../dao/mongo/models/carts.model.js";
import CartsRepository from "../repositories/carts.repository.js"
import ProductsRepository from "../repositories/products.repository.js";
import { generatePurchase } from "./tickets.service.js";


//const cartsManager = new Carts();
const cartsRepository = new CartsRepository();
const productsRepository = new ProductsRepository();



const getAllCarts = async () => {
    const carts = await cartsRepository.get();
    return carts;
}

const saveCart = async () => {
   
        const result = await cartsRepository.create();
        return result;
     
}

const purchase = async (cid, user) => {
        // En este punto, ya tienes un carrito con productos agregados
        // 1. Deberías obtener el carrito por CID, el repositorio de carritos para buscar el carrito por ID

        const cartProducts = await getCartsById(cid);
        console.log("Cartproducts", JSON.stringify(cartProducts, null, 2));
    
        // 2. Iterar sobre el arreglo de productos que forman parte del carrito
        let amount = 0;
    
        // En este arreglo vamos a almacenar los productos que no tenemos stock
        const outStock = [];
    
        // Iterar sobre el arreglo de productos en el carrito
        for (const cartProduct of cartProducts) {
            for (const cartItem of cartProduct.products) {
                const product = cartItem.product;
                const stock = product.stock;
    
                // Resto de tu lógica aquí...
                if (stock >= cartItem.quantity) {
                    amount += product.price * cartItem.quantity;
                    product.stock -= cartItem.quantity;
    
                    // Utilizar el repositorio de productos y actualizar el producto
                    await productsRepository.updatedProducts(product._id, product);
                } else {
                    outStock.push({ product, quantity: cartItem.quantity });
                }
            }
        }

        // Actualizar el carrito con el nuevo arreglo de productos que no pudieron comprarse
        // Utilizar el repositorio de carritos para actualizar los productos
        await cartsRepository.updateProductsInCart(cid, outStock);
    
        const ticket = await generatePurchase(user, amount);
        console.log("Ticket", ticket);
        return {ticket};
       
    
};
    


const updateProductsInCart  = async (carritoId, products) => {

        const result = await cartsRepository.updateProductsInCart(carritoId, products);
        return result;
   
}

const updateQuantityProductInCar = async  (cartId, productId, newQuantity) => {

        const result = await cartsRepository.updateQuantityProductInCar(cartId, productId, newQuantity);
        return result;
}

const addProductInCart = async  (cartId, productId, userId) =>{

        const result = await cartsRepository.addProductInCart(cartId, productId, userId)
        return result;

}

const deleteProductInCart = async  (req, res) => {

        const result = await cartsRepository.deleteProductInCart(cartId);
        return result;

}

const deleteProduct = async (cid, pid) => {

        const result = await cartsRepository.deleteProduct(cid, pid);
        return result;
}

    //populate
    const getCartsById = async (Cartid) => {

            console.log("cid service", Cartid);
            const cart = await cartsRepository.getCartsById(Cartid);    
            console.log("cart service", cart);
            const result = await cartsModel.find(cart).populate('products.product');   
            console.log("result serviec", result); 
            console.log("Populate", JSON.stringify(result));    
            return result;

     }



export {
    getAllCarts,
    saveCart,
    updateProductsInCart,
    updateQuantityProductInCar,
    addProductInCart,
    deleteProductInCart,
    deleteProduct,
    getCartsById,
    purchase
}