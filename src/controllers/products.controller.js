import {getAllProducts as getAllProductsServices, saveProduct as saveProductServices,
   getProductsById as getProductsByIdServices, deleteProduct as deleteProductServices,
   updatedProducts as updatedProductsServices} from '../services/products.service.js';
import CustomError from '../middlewares/errors/customError.js';
import EErrors from '../middlewares/errors/enums.js';


const getAllProducts = async (req, res) => {
      try {

         console.log("ingreso sisisisisi")
         let { limit, page, sort, query, queryValue } = req.query;
   
         const search = await getAllProductsServices({
               limit,
               page,
               sort,
               query,
               queryValue
         });
   
         res.sendSuccess(search);   
      } catch (error) {
         req.logger.error(`Error getting products: ${error.message}`, { error });
      } 
   }

   const saveProduct = async (req, res, next) => {

      try {
         const {title, description, code, price, status, stock, category, thumbnail} = req.body
      
      if (!title || !description || !code || !price || !status || !category || !thumbnail) {
         //return res.sendClientError('incomplete values');
         throw CustomError.createError({                    
            name: 'UserError',
            cause: 'Incomplete values',
            message: 'Error trying to save product',
            code: EErrors.INVALID_TYPE_ERROR
          })
      }        

      //console.log("user_id es +++++", req.user._id)
      // si un producto se crea sin owner se debe colocar por defecto admin 
      const ownerId = req.user ? req.user._id : 'ADMIN';
      
      const result = await  saveProductServices({
         title,
         description,
         code,
         price,
         status,
         stock,
         category,
         thumbnail,
         owner:ownerId
      });   
      //res.sendSuccess(result); 
      res.send({status:"success", payload:result})
      } catch (error) {
         req.logger.error(`Error saving products: ${error.message}`, { error });
         next(error);
      }
   
   }

   const getProductsById= async  (req, res, next) =>{
      try {
         let id = req.params.id //ojo es un string 
         const result = await getProductsByIdServices(id)

         if (!result) {
            //return res.sendClientError('incomplete values');
            throw CustomError.createError({                    
               name: 'ProductFindByIdError',
               cause: 'Product not found',
               message: 'Error trying to find product by Id',
               code: EErrors.PRODUCT_NOT_FOUND
             })
         }  

         res.sendSuccess(result);  
      } catch (error) {
         //res.sendServerError(error.message);
         next(error);
      }
   
   }



const deleteProduct = async (req, res) => {
   try {
       const productId = req.params.id;
       const userId = req.user._id; // Obtener el ID del usuario autenticado
       const userRole = req.user.role ? req.user.role.toLowerCase() : '';

       // Verificar la autorización para eliminar el producto
       const product = await getProductsByIdServices(productId);

       if (!product || (product.owner === null || product.owner === undefined) && userRole === 'admin' || (userRole === 'premium' && product.owner && product.owner.toString() === userId)) {
         // Permitir la eliminación si el usuario es 'admin' o 'premium' y es el propietario del producto
         const result = await deleteProductServices(productId);
         req.logger.info(`Product with ID ${productId} deleted successfully`);
         res.sendSuccess(result);
     } else {
         throw new Error('You are not authorized to delete this product.');
     }
     
   } catch (error) {
       res.sendServerError(error.message);
   }
};


   const updatedProducts = async (req, res) => {
      try {
         const {title, description, code, price, status, stock, category, thumbnail} = req.body
         const {id} = req.params;
   
         if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
            return res.sendClientError('incomplete values');
         }

         const result = await updatedProductsServices(id,{
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
         });
   
         res.sendSuccess(result); 
   
      } catch (error) {
         res.sendServerError(error.message);
      }  
   
   }

   export {
    getAllProducts,
    saveProduct,
    getProductsById,
    deleteProduct,
    updatedProducts

   }


