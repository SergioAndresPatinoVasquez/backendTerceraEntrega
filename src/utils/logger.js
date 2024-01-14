import winston from 'winston';
import config from '../config/config.js';

const customLevelOptinons = {
    levels : {
        fatal: 0,
        error : 1,
        warning : 2,
        info : 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal : 'red', 
        error: 'magenta',
        warning: 'yellow',
        info: 'green',
        http: 'blue',
        debug: 'cyan'
    }
};

let logger;

if(config.environment === 'production'){
    //a nivel de producción
    logger = winston.createLogger({
    levels: customLevelOptinons.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({
                    all: true,
                    colors: customLevelOptinons.colors
                }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'src/logs/errorsProduction.log',
            level: 'error'         
        })
    ]
})
}else if(config.environment === 'develop') {
   //a nivel de desarrollo
   logger = winston.createLogger({
    levels: customLevelOptinons.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({
                    all: true,
                    colors: customLevelOptinons.colors
                }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'src/logs/errorsDevelop.log',
            level: 'error'
        })
    ]
})
}

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`)
    next();
}