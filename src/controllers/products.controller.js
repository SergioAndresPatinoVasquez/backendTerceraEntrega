import {getAllProducts as getAllProductsServices, saveProduct as saveProductServices,
   getProductsById as getProductsByIdServices, deleteProduct as deleteProductServices,
   updatedProducts as updatedProductsServices} from '../services/products.service.js';


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

   const saveProduct = async (req, res) => {

      try {
         const {title, description, code, price, status, stock, category, thumbnail} = req.body
      
      if (!title || !description || !code || !price || !status || !category || !thumbnail) {
         return res.sendClientError('incomplete values');
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
         res.sendServerError(error.message);
      }
   
   }

   const getProductsById= async  (req, res) =>{
      try {
         let id = req.params.id //ojo es un string 
         console.log("id req:", id);
         const result = await getProductsByIdServices(id)
         res.sendSuccess(result);  
      } catch (error) {
         res.sendServerError(error.message);
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


