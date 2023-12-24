
import passport from 'passport';
import jwt from 'passport-jwt';
import usersModel from '../dao/mongo/models/users.model.js';
import { passportStrategiesEnum } from './enums.config.js';
import { PRIVATE_KEY_JWT } from './constants.config.js';
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
        secretOrKey: PRIVATE_KEY_JWT

    }, async(jwt_payload, done) => {
        try {
            console.log('JWT Payload:', jwt_payload);
            return done(null, jwt_payload.user) //req.user
        } catch (error) {
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
            console.log("profile",profile);
            const email =  profile.emails[0].value;
            const user = await usersModel.findOne({ email });
            console.log("user", user)
            console.log("user", email)

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
            console.error('Error en la autenticación de GitHub:', error);
            return done('Incorrect credentials compa');
        }
    }));


    //Serialización y deSerialización
    passport.serializeUser((user, done)=>{
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done) =>{
        const user = await usersModel.findById(id);
        done(null, user);
    })

};


export default initializePassport;

