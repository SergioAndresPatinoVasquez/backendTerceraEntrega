import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js';
import { fakerES as faker} from '@faker-js/faker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//1. hashear nuestra constraseña
const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//2. validar nuestro password
const isValidPassword = (plainPassword, hashedPassword) =>
    bcrypt.compareSync(plainPassword, hashedPassword)


const generateToken = (user, expiresIn) => {
    const token = jwt.sign({ user }, config.jwt_key, { expiresIn });
    return token;
}

const verifyToken = (token) => {
    try {
      const isValidToken = jwt.verify(token, config.jwt_key);
      return isValidToken;
    } catch (error) {
      return null;
    }
  };

const generateUsers = () => {
    const numberOfProducts = faker.number.int({min:1, max:5});
    let products = [];

    for (let i=0; i < numberOfProducts; i++){
        products.push(generateProduct());
    }

    return{
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({min:18, max:100}),
        password: faker.internet.password(),        
        role : faker.helpers.arrayElement(['user','admin','public']),
        products
    };
}

const generateProduct = () =>{

    return{
        id: faker.database.mongodbObjectId(),
        title : faker.commerce.productName(),
        description : faker.commerce.productDescription(),
        price : faker.commerce.price(),
        stock : faker.number.int(1),
        code : faker.string.alphanumeric(10),
        category : faker.commerce.department(),
        thumbnail : faker.image.url()
    }
}


export {
    __dirname,
    createHash,
    isValidPassword,
    generateToken,
    verifyToken,
    generateUsers
};