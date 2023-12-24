import express, { Router } from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import initializePassport from './config/passport.config.js'; 
import mongoose from 'mongoose';
import { __dirname } from './utils.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import ViewsRouter from './routes/views.routes.js'
import UsersRouter from './routes/users.routes.js'
import CartsRouter from './routes/carts.routes.js'
import ProductsRouter from './routes/products.routes.js';
import githubRouter from './routes/sessions.routes.js';
import configs from './config/config.js';
import { passportStrategiesEnum } from './config/enums.config.js';


const app = express();

const viewsRouter = new ViewsRouter();
const usersRouter = new UsersRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();

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

console.log(configs)

//ya esta en factory
try {
    await mongoose.connect(configs.mongoUrl)
    console.log('DB connected')

} catch (error) {
    console.log(error.message)
}

app.listen(configs.port, () => console.log('Server running'));

// await mongoose.connect('mongodb+srv://sergioandres98:seryus1984@mongodb101.2xndcrf.mongodb.net/segundaPractica?retryWrites=true&w=majority')
