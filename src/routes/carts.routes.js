import Router from './router.js'
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.config.js';
import { getAllCarts, saveCart, updateProductsInCart, updateQuantityProductInCar, addProductInCart,
         deleteProductInCart, deleteProduct, getCartsById, purchase} from '../controllers/carts.controller.js';

export default class CartsRouter extends Router {
    constructor(){
        super();
    }

    init () {
        this.get('/', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC,accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, getAllCarts)
        this.post('/', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC,accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, saveCart)
        this.put('/:cid', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC,accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, updateProductsInCart)
        this.put('/:cid/products/:pid', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC,accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, updateQuantityProductInCar)
        this.post('/:cid/products/:pid', [accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, addProductInCart)
        this.delete('/:cid', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC,accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, deleteProductInCart)
        this.delete('/:cid/products/:pid', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC,accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, deleteProduct)
        this.get('/:cid', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC,accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, getCartsById)
        this.get('/:cid/purchase', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC,accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, purchase)


    }

}

