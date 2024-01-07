import Router from './router.js';
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.config.js";
import { login, register, usersMocking} from '../controllers/users.controller.js';

export default class UsersRouter extends Router {
   constructor(){
       super();
   }

   init () {
      this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, login);
      this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, register);
      this.get('/mockingproducts', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, usersMocking);

    }

}

