import Router from './router.js';
import passport from 'passport';
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.config.js";
import { getAllProducts, saveProduct, getProductsById, deleteProduct, updatedProducts} from '../controllers/products.controller.js';

export default class ProductsRouter extends Router {
   constructor(){
       super();
   }

   init () {
      this.get('/', [accessRolesEnum.USER, accessRolesEnum.PUBLIC, accessRolesEnum.ADMIN], passport.authenticate(passportStrategiesEnum.JWT), getAllProducts)
      this.post('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, saveProduct)
      this.get('/:id', [accessRolesEnum.ADMIN, accessRolesEnum.USER], passportStrategiesEnum.JWT, getProductsById)
      this.delete('/:id', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, deleteProduct)
      this.put('/:id', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, updatedProducts)
    
   }

}

