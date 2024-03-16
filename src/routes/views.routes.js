import Router from './router.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.config.js';
import { productsView, cartsView, cartsIdView, registerView, loginView, currentView, loggerTest, newPassword, resetPassword, getUserCart, comprarProducto} from '../controllers/views.controller.js';


export default class ViewsRouter extends Router{
    constructor(){
        super();

    }

    init () {
      this.get('/products', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC, accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, productsView);
      this.get('/carts', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC, accessRolesEnum.USER], passportStrategiesEnum.JWT, cartsView)
      this.get('/cartsId-view/:cid', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC, accessRolesEnum.USER], passportStrategiesEnum.JWT, cartsIdView)
      this.get('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, registerView);
      this.get('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, loginView);
      this.get('/current', [accessRolesEnum.ADMIN, accessRolesEnum.PUBLIC, accessRolesEnum.USER], passportStrategiesEnum.JWT, currentView);
      this.get('/loggerTest', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, loggerTest);
      this.get('/newPassword', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, newPassword);
      this.get('/reset-password', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, resetPassword);

      this.get('/userCart', [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, getUserCart);
      this.post('/comprar', [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, comprarProducto);

    }

}
