
import passport from 'passport';
import jwt from 'passport-jwt';
import usersModel from '../dao/mongo/models/users.model.js';
import { passportStrategiesEnum } from './enums.config.js';
import config from '../config/config.js';
import GitHubStrategy from 'passport-github2';


const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;


const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies['coderCookieToken'];
    }
    return token;
}

const initializePassport = () => {
    passport.use(passportStrategiesEnum.JWT, new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwt_key//PRIVATE_KEY_JWT

    }, async(jwt_payload, done) => {
        try {
            console.log('Middleware de Passport ejecutándose...');
            console.log('Token recibido:', jwt_payload); // Agrega esta línea para imprimir el token recibido
            return done(null, jwt_payload.user) //req.user
        } catch (error) {
            console.error('Error en middleware de Passport:', error);
            return done(error);
        }
    }))

    //poner aca lo de github
    passport.use('github', new GitHubStrategy({ 
        clientID: 'Iv1.6e82d9980f9d4a38',
        clientSecret: 'e518bfba7c10c19b4e2d7cf9e68e38c613930977',
        callbackURL: 'http://localhost:8080/api/sessions/github-callback',
        scope:['user:email']

    }, async (accessToken, refreshToken, profile, done,) =>{
        try {

            const email =  profile.emails[0].value;
            const user = await usersModel.findOne({ email });

            if(!user){//valido el correo
                //crear la cuenta o usuario desde cero
                const newUser ={
                    first_name: profile._json.name,
                    last_name: '', //no viene desde github
                    age: 18, //no viene desde github
                    email,
                    password: '' //no se requiere, el trabajo ya lo hace github 
                }
               
                const result = await usersModel.create(newUser);

                return done(null, result); //req.user
            } else{
                return done(null, user);
            }        
        } catch (error) {
            req.logger.error(`Incorrect credential GitHub: ${error.message}`, { error });
            return done('Incorrect credentials');
        }
    }));


    // //Serialización y deSerialización
    passport.serializeUser((user, done)=>{
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done) =>{
        const user = await usersModel.findById(id);
        done(null, user);
    })

};


export default initializePassport;

