import ProductsRepository from "../repositories/products.repository.js"

const productsRepository = new ProductsRepository();


const getAllProducts = async (limit,page,sort,query,queryValue) =>{

   const result = await productsRepository.getProductsByQuery(limit,page,sort,query,queryValue);
   return result;
}

const saveProduct = async (title, description, code, price, status, stock, category, thumbnail, owner) =>{

    const result = await productsRepository.create(title, description, code, price, status, stock, category, thumbnail, owner);
    return result;
 }

 const getProductsById = async (id) => {

    const result = await productsRepository.getProductsById(id);
    return result;
 }


 const deleteProduct = async (id) => {

    const result = productsRepository.deleteProduct(id);
    return result;
 }

 const updatedProducts = async (id, {title, description, code, price, status, stock, category, thumbnail}) =>{
    const result = await productsRepository.updatedProducts(id, {title, description, code, price, status, stock, category, thumbnail});
    return result;
 }
 
export {
    getAllProducts,
    saveProduct,
    getProductsById,
    deleteProduct,
    updatedProducts

}

