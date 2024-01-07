import {getAllProducts as getAllProductsServices, saveProduct as saveProductServices,
   getProductsById as getProductsByIdServices, deleteProduct as deleteProductServices,
   updatedProducts as updatedProductsServices} from '../services/products.service.js';
import CustomError from '../middlewares/errors/customError.js';
import EErrors from '../middlewares/errors/enums.js';


const getAllProducts = async (req, res) => {
      try {
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
         res.sendServerError(error.message);
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
      const result = await  saveProductServices({
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
         //res.sendServerError(error.message);
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

   const deleteProduct = async (req, res) =>{
      try {
         let id = req.params.id
         const result = await deleteProductServices(id);
         res.sendSuccess(result); 
      } catch (error) {
         res.sendServerError(error.message);
      }
   
   }

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


