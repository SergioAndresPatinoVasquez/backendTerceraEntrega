import { fileURLToPath } from 'url';
//import { dirname } from 'path';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js';
import { fakerES as faker} from '@faker-js/faker';
import multer from 'multer';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __mainDirname = path.join(__dirname,'..') //clase39

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Obtén el valor del atributo 'name' del archivo
        const folderName = req.body.name || 'documents'; // Si no se proporciona el atributo 'name', se usa 'documents' como valor predeterminado
        console.log("req.body multer", folderName)
        // Crea la carpeta si no existe
        const uploadFolder = `${__dirname}/public/img/${folderName}`;
        fs.mkdirSync(uploadFolder, { recursive: true });

        // Llama a la función de devolución de llamada con la carpeta de destino
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const userId = req.params.uid || 'defaultUserId'; // Si no hay userId en los parámetros, usa un valor predeterminado
        const modifiedFileName = `${userId}-${file.originalname}`;
        cb(null, modifiedFileName);
      }
});

const uploader = multer({
    storage,
    onError: (err, next) => {
        console.log(err.message);
        next();
    }
});



export {
    __mainDirname,
    __dirname,
    createHash,
    isValidPassword,
    generateToken,
    verifyToken,
    generateUsers,
    uploader
};