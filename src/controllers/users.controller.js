import { generateToken, isValidPassword } from "../utils.js";
import {getByemailLogin as getByemailLoginServices, getByemailRegister as getByemailRegisterServices,
      saveServices} from '../services/users.service.js';


const login = async  (req, res)=> {
        try {
           const {email, password} = req.body
           if(!email || !password){
              return res.sendClientError('incomplete values')
           }
    
          const user = await getByemailLoginServices(email);
          if(!user){
            return res.sendClientError('incorrect credential')
          }
    
          const comparePassword = isValidPassword(password, user.password);
    
          if(!comparePassword){
            return res.sendClientError('incorrect credential')
          }

          const userId = user._id;
          console.log("user id", userId);

          //eliminado el password de las cookies
          const{password:_, ...userResult} = user
    
          const accessToken = generateToken(userResult);
          console.log("Token login", accessToken)
          res.cookie('coderCookieToken', accessToken, {maxAge: 60 * 60 * 1000, httpOnly: true}).send({status:'success', message:'login success'})
          //res.sendSuccess(accessToken);       
         
        } catch (error) {
           res.sendServerError(error.message);
        } 
     }



    const register =   async (req, res) => {
            try {
                const { first_name, last_name, email, age, role, password } = req.body;
        
                // Agrega la lógica de validación según tus necesidades
                if (!first_name || !last_name || !email || !age || !role || !password ) {
                    return res.status(400).json({ error: 'incomplete values' });
                }
        
                const existsUser = await getByemailRegisterServices(email);
        
                if (existsUser) {
                    return res.status(400).json({ error: 'user already exists' });
                }
        
                const result = await saveServices(first_name, last_name, email, age, role, password);
        
                const accessToken = generateToken(result);
                res.status(201).json({ status: 'success', access_token: accessToken });
                
            } catch (error) {
                console.error('Error en el registro:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }




     export {
        login,
        register
     }