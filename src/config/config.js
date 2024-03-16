import dotenv from 'dotenv';

dotenv.config();

const configs = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    persistence: process.env.PERSISTENCE,
    jwt_key: process.env.PRIVATE_KEY_JWT,
    environment: process.env.ENVIRONMENT,
    mail: process.env.MAIL,
    pass: process.env.PASS
};

console.log(process.env.PORT);
console.log(process.env.MONGO_URL);


export default configs;

