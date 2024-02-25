import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import initializePassport from './config/passport.config.js'; 
import mongoose from 'mongoose';
import { __mainDirname, __dirname } from './utils.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import ViewsRouter from './routes/views.routes.js'
import UsersRouter from './routes/users.routes.js'
import CartsRouter from './routes/carts.routes.js'
import ProductsRouter from './routes/products.routes.js';
import githubRouter from './routes/sessions.routes.js';
import configs from './config/config.js';
import { passportStrategiesEnum } from './config/enums.config.js';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import errorHandler from './middlewares/errors/index.js';
import toAsyncRouter from 'async-express-decorator';
import { addLogger } from './utils/logger.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const app = express();

const viewsRouter = new ViewsRouter();
const usersRouter = toAsyncRouter(new UsersRouter());
const productsRouter = toAsyncRouter(new ProductsRouter());
const cartsRouter = new CartsRouter();


//Mensajes por gmail*********************************************/
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user:'sergioandres98@gmail.com',
        pass: 'gqirofuvghvxkdbg'
    }
});

app.get('/mail', async(req, res) =>{
    await transporter.sendMail({
        from: 'Coder',
        to: 'sergioandres98@gmail.com',
        subject: 'correo de prueba',
        html:'<div><h1>Hola, es una prueba </h1></div>',
        attachments: []
    })
    res.send('Correo enviado')
})
//*********************************************************/

//Twilio******************************************************
const TWILIO_ACCOUNT_SID = 'AC502bd47d4835949da5f5ed1f6227f4b1';
const TWILIO_AUTH_TOKEN = '756752a9bfecafa2f826a43b34820663';
const TWILIO_PHONE_NUMBER = '+12134936769';

const client = twilio(
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER
)

app.get('/sms', async (req, res)=>{
    await client.messages.create({
        from: TWILIO_PHONE_NUMBER,
        to: '+573012895266',
        body: 'Este es un mensaje de prueba de SMS'
    });
    res.send('SMS ENVIADO')
});

app.get('/whatsapp', async (req, res)=>{
    await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+573012895266',
        body: 'Este es un mensaje de prueba de Whatsapp'
    });
    res.send('WHATSAPP ENVIADO')
});

//**********************Clase39*********************************** */
console.log(__mainDirname);
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación Del Proyecto Ecommerce',
            description: 'API pensada en resolver el proceso de agregar productos y recibir compras.'
        }
    },
    apis: [`${__mainDirname}/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//************************************************************************ */

app.use(session({
    // store: MongoStore.create({
    //     client: mongoose.connection.getClient(),
    //     ttl: 3600
    // }),
    secret: 'Coder5575Secret',
    resave: true, //nos sirve para poder refrescar o actualizar la sesión luego de un de inactivadad
    saveUninitialized: true, //nos sirve para desactivar el almacenamiento de la session si el usuario aún no se ha identificado o aún no a iniciado sesión
    // cookie: {
    //     maxAge: 30000
    // }
}));


initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger);
//app.use("/api", passport.authenticate(passportStrategiesEnum.JWT));


app.use(express.json())
app.use(express.urlencoded({ extended: true}));

app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use(cookieParser());

app.use("/api/sessions", githubRouter);
app.use("/", viewsRouter.getRouter());
app.use("/api/users", usersRouter.getRouter());

app.use("/api", passport.authenticate(passportStrategiesEnum.JWT))

app.use("/api/products", productsRouter.getRouter());
app.use("/api/purchase", cartsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());

app.use(errorHandler);

console.log(configs)

try {
    await mongoose.connect(configs.mongoUrl)
    console.log('DB connected')

} catch (error) {
    console.log(error.message)
}

app.listen(configs.port, () => console.log('Server running'));

