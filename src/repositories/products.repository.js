//import ProductsManager from "../dao/mongo/products.mongo.js";
import {Products} from "../dao/factory.js";

export default class ProductsRepository {

    constructor() {
        this.dao = new Products();
    }

    get = async () => { //getAll
        const products = await this.dao.get();
        return products;

    }

    create = async (product) => { //save        
        const result = await this.dao.create(product);
        return result;

    }

    getProductsByQuery = async ({
        limit,
        page,
        sort,
        query,
        queryValue
    }) => {
        let filter = {};

        if (!query || !queryValue) {

        } else {
            filter = {
                [query]: queryValue
            };
        }


        const option = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sort: {
                ["price"]: sort
            }
        };
        console.log("filter", filter)
        console.log("option", option)


        const result = await this.dao.getProductsByQuery(filter, option)
        console.log(JSON.stringify(result, null, '\t'));
        return result;
    }

    getProductsById = async (id) => {


        let products = await this.dao.getProductsById();
        let productsById = products.find(prod => prod._id.toString() === id)
        return productsById;
    }

    deleteProduct = async (id) => {
        const result = await this.dao.deleteProduct({
            _id: id
        });
        return result;
    }


    updatedProducts = async (id, product) => {

        const result = await this.dao.updatedProducts({_id: id}, product);
        return result;
    }
}