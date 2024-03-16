
import { getAllCarts as getAllCartsServices, saveCart as saveCartsServices,
       updateProductsInCart as updateProductsInCartServices,
       updateQuantityProductInCar as updateQuantityProductInCarServices,
       addProductInCart as addProductInCartServices,
       deleteProductInCart as deleteProductInCartServices,
       deleteProduct as deleteProductService,
       getCartsById as getCartsByIdService,
       purchase as purchaseService} from '../services/carts.service.js'
import { getProductsById } from '../services/products.service.js';



  const getAllCarts =  async (req, res) => {
        try {
            console.log("carros")
            const carts = await getAllCartsServices();
            res.sendSuccess(carts);
        } catch (error) {
            res.sendServerError(error.message);
        }
        
    }

    const saveCart = async (req,res) => {
        try {
   
            const result = await saveCartsServices();
            res.sendSuccess({_id:result._id});
        } catch (error) {
            res.sendServerError(error.message);
        }    
    }

    const updateProductsInCart  = async (req,res) => {
        try {
            let carritoId= req.params.cid;
            const products =req.body;      
            
            const result = await updateProductsInCartServices(carritoId, products);
            
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    const updateQuantityProductInCar = async  (req,res) => {
        try {
            const cartId= req.params.cid;
            const productId= req.params.pid;
            const newQuantity =req.body.quantity;       
            
            const result = await updateQuantityProductInCarServices(cartId, productId, newQuantity);
            
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    const addProductInCart = async (req, res) => {
        try {
            let cartId = req.params.cid;
            let productId = req.params.pid;
    
            const userId = req.user._id;
            const userRole = req.user.role ? req.user.role.toLowerCase() : '';
            console.log("role",userRole)
    
            // Verificar si el usuario es 'PREMIUM' y el producto le pertenece
            const product = await getProductsById(productId);
    
        // Verificar si el usuario es 'PREMIUM' y el producto le pertenece
        if (userRole === 'premium' && product && (product.owner ? product.owner.toString() : 'admin') === userId) {
            throw new Error('You cannot add your own product to the cart.');
        }
    
            const result = await addProductInCartServices(cartId, productId, userId);
            console.log("result", result)
    
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        }
    };
    

    const deleteProductInCart = async  (req, res) => {
        try {
            const cartId = req.params.cid;
    
            const result = await deleteProductInCartServices(cartId);
            
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
    
        }
    
    }

    const deleteProduct = async  (req, res) => {
        try {
            const { cid, pid} = req.params;    
            const result = await deleteProductService(cid, pid);
            
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
    
        }
    
    }
    //populate
    const getCartsById = async  (req, res) => {
        try {
            let Cartid = req.params.cid;
            console.log("cid", Cartid);
            const result = await getCartsByIdService(Cartid);    
                 
            res.send(result);
    
        } catch (error) {            
            res.sendServerError(error.message);  
        }    

    }

    const purchase = async (req,res) =>{
        try {
            const cid = req.params.cid;
            const user = req.user;
            const result = await purchaseService(cid, user);
            res.json(result);
        } catch (error) {
            res.sendServerError(error.message);  
        }
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