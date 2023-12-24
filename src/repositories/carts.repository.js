//import CartsManager from '../dao/mongo/carts.mongo.js';
import {Carts} from '../dao/factory.js';
import {Users} from '../dao/factory.js';

//import { cartsModel } from '../dao/dbManagers/models/carts.model.js';

export default class CartsRepository {
    constructor(){
        this.dao = new Carts();
        this.usersDao = new Users();
    }

    get = async () =>{ //getAll
        const carts = await this.dao.get();
        return carts;

    }

    create = async () => { //save   

        const result = await this.dao.create({});

        return result; 
    }

    update = async (id, cart) =>{
        const result = await this.dao.update({_id: id}, cart);
        return result;
    };

    updateProductsInCart = async (carritoId, products) =>{
        
        //buscar el carrito por su id
        const carrito = await this.dao.updateProductsInCart(carritoId);

        if(!carrito){
           console.log("el carrito con id seleccionado no exite")
        }

        //se eliminan todos los productos existentes en el carrito
        carrito.products = [];

        //se agrega el nuevo producto
        products.forEach(producto => {
            carrito.products.push(producto);
          });

          console.log("el carrito", carrito)

        //se guarda el carrito actualizado
        const result= await carrito.save();

        return result;
    }

    updateQuantityProductInCar = async(cartId, productId,newQuantity) =>{
        //busco el carrito por id
        const carrito = await this.dao.updateQuantityProductInCar(cartId);
        console.log("carrito", carrito)

        if(!carrito){
            console.log("el carrito buscado no existe");
        }

        //Se busca el producto en el carrito
        const productInCart = carrito.products.find(producto => producto.product.toString() === productId);
        console.log("productInCart", productInCart)

        if(!productInCart) console.log("El producto no fue encontrado dentro del carrito")

        //se actualiza la cantidad
        productInCart.quantity= newQuantity;

        //se guarda el carrito actualizado
        const result = await carrito.save();
    }

    deleteProductInCart = async (cid) =>{
        //busco el carrito
        const carrito = await this.dao.deleteProductInCart(cid);

        if(!carrito){
            return console.log("El carrito no existe")
        }

        //se limpian el array de productos
        carrito.products = [];

        //se guarda el carrito actualizado
        const result = await carrito.save();
    }


    getCartsById = async (Cartid)=>{ 

            const carrito = await this.dao.getCartsById(Cartid);          
            if(!carrito) return console.log("Carrito No encontrado")            
            return carrito;
    }


    addProductInCart = async (cartId, productId, userId) =>{

        //encontrando el carrito por ID
        const carrito = await this.dao.addProductInCart(cartId);

        if(!carrito){
        // Manejar el caso en que el carrito no existe
        console.log("El carrito no existe");
        return null;
        }

        //se verifica si el producto ya existe en el carrito
        const productInCart = carrito.products.find(p => p.product.toString() === productId);

        if (productInCart){ //si existe aumento solo la cantidad
            productInCart.quantity += 1;

        }else{ //si no existe lo creo
            carrito.products.push({product: productId, quantity:1});

        }
        //guardar el carrito actualizado
        const result = await carrito.save();

        console.log("userId", userId)
        //console.log('Usuario antes de la actualización:', user);
        // Actualizar el modelo de usuario con el nuevo carrito
         
         try {
            const user = await this.usersDao.getByUserId(userId);
            console.log('Usuario antes de la actualización:', user);
            if (user) {
                user.cartId.push({ cart: cartId });
                 await user.save();
             }
            
         } catch (error) {
            console.error('Error al actualizar el modelo de usuario:', error);

         }


        return result;

    }

    deleteProduct = async(cid,pid)=>{
        const result = await this.dao.deleteProduct({_id:cid},{$pull:{products:{product:pid}}})
        console.log("resultado carro", result)
        return result;
    }

}