import Router from './router.js';
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.config.js";
import { login, register, usersMocking, sendPasswordResetLink, passwordChanged, changeUserRole} from '../controllers/users.controller.js';

export default class UsersRouter extends Router {
   constructor(){
       super();
   }

   init () {
      this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, login);
      this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, register);
      this.get('/mockingproducts', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, usersMocking);
      this.post('/password-link', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, sendPasswordResetLink);
      this.post('/password-changed', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, passwordChanged);
      this.put('/premium/:uid', [accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, changeUserRole);

    }

}

