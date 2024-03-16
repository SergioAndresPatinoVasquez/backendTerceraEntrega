import Router from './router.js';
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.config.js";
import { login, register, usersMocking, sendPasswordResetLink, passwordChanged, changeUserRole, uploadDocuments, getAllUsers
, deleteInactiveUsers} from '../controllers/users.controller.js';
import { uploader } from '../utils.js';
import { checkRequiredDocumentsMiddleware } from '../middlewares/premium.js';

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
      this.put('/premium/:uid', [accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, checkRequiredDocumentsMiddleware, changeUserRole);
      this.post('/:uid/documents', [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, uploader.array('thumbnail'), uploadDocuments);

      //endpoints puntos trabajo final
      this.get('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getAllUsers);
      this.delete('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, deleteInactiveUsers);


    }

}

