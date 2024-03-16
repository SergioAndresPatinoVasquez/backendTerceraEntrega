import { Router as expressRouter } from 'express';
import passport from 'passport';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.config.js';

export default class Router {
    constructor() {
        this.router = expressRouter();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() {}

    get(path, policies, strategy, ...callbacks) {
        this.router.get(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    post(path, policies, strategy, ...callbacks) {
        this.router.post(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    put(path, policies, strategy, ...callbacks) {
        this.router.put(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    delete(path, policies, strategy, ...callbacks) {
        this.router.delete(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    generateCustomResponse = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({ data });
        };

        res.sendSuccessNewResourse = (data) => {
            res.status(201).json({ data });
        };

        res.sendServerError = (error) => {
            res.status(500).json( { error } )
        };

        res.sendClientError = (error) => {
            res.status(400).json({ error });
        };

        next();
    }

    applyCustomPassportCall = (strategy) => (req, res, next) => {
        console.log("Estrategia de autenticación:", strategy);

        if (strategy === passportStrategiesEnum.JWT) {
            //custom passport call
            console.log("ingresa strategy", strategy)
            console.log("ingresa passportStrategiesEnum.JWT", passportStrategiesEnum.JWT)
  
            passport.authenticate(strategy, function (err, user, info) {
                if (err) {
                    console.error("Error en la autenticación:", err);
                    return next(err);
                }

                if (!user) {
                    console.log("Usuario no autenticado. Enviando 401.");
                    return res.status(401).send({
                        error: info.messages ? info.messages : info.toString()
                    });
                }

                console.log("Usuario autenticado:", user);
                req.user = user;
                next();
            })(req, res, next);
        } else {
            console.log("No se requiere autenticación Passport")
            next();
        }
    }

    // handlePolicies = (policies) => (req, res, next) => {
        
    //     if (policies[0] === accessRolesEnum.PUBLIC) return next();

    //     const user = req.user;

    
    //     if (!user || !user.role || !policies.includes(user.role.toUpperCase())) {
    //         return res.status(403).json({ error: 'not permissions' });
    //     }
    
    //     next();
    // }
    handlePolicies = (policies) => (req, res, next) => {
        console.log("Policies:", policies);
    
        if (policies[0] === accessRolesEnum.PUBLIC) {
            console.log("Acceso público permitido");
            return next();
        }
    
        const user = req.user;
    
        if (!user) {
            console.log("Usuario no autenticado");
            return res.status(403).json({ error: 'not permissions - user not authenticated' });
        }
    
        if (!user.role) {
            console.log("Usuario sin rol");
            return res.status(403).json({ error: 'not permissions - user has no role' });
        }
    
        const userRole = user.role.toLowerCase(); // Convertir a minúsculas
    
        console.log("Usuario con rol:", userRole);
    
        const policiesLower = policies.map(policy => policy.toLowerCase());

        if (!policiesLower.includes(userRole)) {
            console.log("Usuario no tiene los permisos necesarios");
            return res.status(403).json({ error: 'not permissions - insufficient role' });
        }
    
        console.log("Acceso permitido para usuario con rol:", userRole);
        next();
    }
    
    

    applyCallbacks(callbacks) {
        //mapear los callbacks 1 a 1, obteniedo sus parámetros (req, res)
        return callbacks.map((callback) => async (...params) => {
            try {
                //apply, va a ajecuttar la función callback, a la instancia de nuestra clase que es el router
                await callback.apply(this, params);
            } catch (error) {
                params[1].status(500).json({ status: 'error', message: error.message })
            }
        }) //[req, res]
    }
}