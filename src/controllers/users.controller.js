import { generateToken, isValidPassword, generateUsers } from "../utils.js";
import {getByemailLogin as getByemailLoginServices, getByemailRegister as getByemailRegisterServices,
      saveServices} from '../services/users.service.js';
import CustomError from '../middlewares/errors/customError.js';
import EErrors from '../middlewares/errors/enums.js';



const login = async  (req, res, next)=> {
        try {
           const {email, password} = req.body
           if(!email || !password){
            throw CustomError.createError({                    
              name: 'UserError',
              cause: 'Incomplete values',
              message: 'Error trying to login user',
              code: EErrors.INVALID_TYPE_ERROR
            })
           }
    
          const user = await getByemailLoginServices(email);
          if(!user){
            throw CustomError.createError({                    
              name: 'UserError',
              cause: 'incorrect credential',
              message: 'Error trying to login user by email',
              code: EErrors.INVALID_TYPE_ERROR
            })
          }
    
          const comparePassword = isValidPassword(password, user.password);
    
          if(!comparePassword){
            throw CustomError.createError({                    
              name: 'UserError',
              cause: 'incorrect credential',
              message: 'Error trying to login user by password',
              code: EErrors.INVALID_TYPE_ERROR
            })
          }
          // Advertencia si el usuario no tiene contraseña
          if (!user.password) {
            req.logger.warning(`User ${user.email} does not have a password.`);
          }

          const userId = user._id;

          //eliminado el password de las cookies
          const{password:_, ...userResult} = user
    
          const accessToken = generateToken(userResult);
          req.logger.info(`AccessToken created successfully ${accessToken}`)
          res.cookie('coderCookieToken', accessToken, {maxAge: 60 * 60 * 1000, httpOnly: true}).send({status:'success', message:'login success'})
          //res.sendSuccess(accessToken);       
         
        } catch (error) {
          req.logger.error(`Error in login: ${error.message}`, { error });

          next(error);
        } 
     };



    const register =  async (req, res, next) => {
             try {
                const { first_name, last_name, email, age, role, password } = req.body;
        
                // Agrega la lógica de validación según tus necesidades
                if (!first_name || !last_name || !email || !age || !role || !password ) {                  
                  throw CustomError.createError({                    
                    name: 'UserError',
                    cause: 'Incomplete values',
                    message: 'Error trying to register user',
                    code: EErrors.INVALID_TYPE_ERROR
                  })
                }
        
                const existsUser = await getByemailRegisterServices(email);
        
                if (existsUser) {

                    throw CustomError.createError({                    
                      name: 'UserError',
                      cause: 'user already exists',
                      message: 'Error trying to register user',
                      code: EErrors.INVALID_TYPE_ERROR
                    })
                }
        
                const result = await saveServices(first_name, last_name, email, age, role, password);
        
                const accessToken = generateToken(result);
                res.status(201).json({ status: 'success', access_token: accessToken });
                
             } catch (error) {
              req.logger.error(`Error in register: ${error.message}`, { error });

              next(error);
             }
        };

        const usersMocking = async (req,res) => {
          let users = [];

          for(let i=0; i<100; i++){
              users.push(generateUsers());
          }

          res.send({
            status: 'ok',
            counter: users.length,
            data: users
          });
        }


     export {
        login,
        register,
        usersMocking
     }

