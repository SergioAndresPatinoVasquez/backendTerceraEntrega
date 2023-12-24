import {productsModel} from './models/products.model.js';

export default class Products {

    constructor(){
        console.log('Trabajando productos con DB')
    }

    get = async () =>{ //getAll
            const products = await productsModel.find().lean();
            return products;
         
    }

    create = async (product) => { //save        
            const result = await productsModel.create(product);
            return result;      
        
    }    

    getProductsByQuery = async (filter,option)=>{
           
            const result = await productsModel.paginate(filter, option)
            //console.log(JSON.stringify(result, null, '\t'));
            return result;
    }

    getProductsById = async (id)=>{

            let products = await this.get();
            return products;
    }

    deleteProduct = async (id)=>{
        const result = await productsModel.deleteOne({_id:id});
        return result;
    }


    updatedProducts = async (id, product) => {
       
        const result = await productsModel.updateOne({_id:id}, product);
        return result;

    }

}

