import UsersDto from '../DTOs/users.dto.js';
import { cartsView as cartsViewService, cartsIdView as cartsIdViewService,
       productsView as productsViewService, getUserCarts} from '../services/views.service.js';
import {verifyToken} from '../utils.js'; 
import nodemailer from 'nodemailer';
import configs from '../config/config.js';


const productsView = async (req,res) => {
        try {
           // Verificar la autenticación del usuario
        if (!req.isAuthenticated()) {
          return res.sendClientError('User not authenticated');
        }

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 2;

            //const user = req.isAuthenticated()? req.user : null;
            const user = req.user; // Obtener el usuario autenticado

            const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsViewService(page, limit);
         
            res.render('products', {
                products: docs,
                hasPrevPage,
                hasNextPage,
                nextPage,
                prevPage,
                limit,
                user
            }); 
    
        } catch (error) {
           res.sendServerError(error.message);
        }
    }

    const cartsView = async (req,res) => {
        try {

            const carts = await cartsViewService();
            res.render('carts', {carts});
        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    const cartsIdView = async  (req,res) =>{
        try {
            const cartId = req.params.cid;
            const cart = await cartsIdViewService();
            res.render('cartId', {cart});
        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    const registerView = async (req, res) => {
        try {
          // Puedes agregar lógica adicional aquí si es necesario
          res.render('register'); // "register" sería el nombre de tu archivo de vista (sin la extensión)
        } catch (error) {
          res.sendServerError(error.message);
        }
      }
 
      const loginView = async (req, res) =>{
        try {
          // Puedes agregar lógica adicional aquí si es necesario
          res.render('login'); // "register" sería el nombre de tu archivo de vista (sin la extensión)
        } catch (error) {
          res.sendServerError(error.message);
        }
      }

      const currentView = async (req, res) => {
        try {
          const {first_name, last_name} = req.user;
          const users = new UsersDto({first_name, last_name})
          res.render('current', {users})
        } catch (error) {
          res.sendServerError(error.message);
        }
      }

      const loggerTest = async (req, res) => {
        try {
          //custom levels
          req.logger.fatal('prueba fatal');
          req.logger.error('prueba error');
          req.logger.warning('prueba warning');
          req.logger.info('prueba info');
          req.logger.http('prueba http');
          req.logger.debug('prueba debug');

          res.send({result: 'Probando winston'})
          
        } catch (error) {
          
        }
      }

      const newPassword = async (req, res) =>{
        try {
          // Puedes agregar lógica adicional aquí si es necesario
          res.render('newPassword'); // "register" sería el nombre de tu archivo de vista (sin la extensión)
        } catch (error) {
          res.sendServerError(error.message);
        }
      }

      const resetPassword = async (req, res) => {
        try {

          const token = req.query.token;

          const isValidToken = verifyToken(token);

          console.log("token valido", isValidToken)

          if (!isValidToken) {
            // Si el token es inválido o ha expirado, puedes redirigir o renderizar un mensaje de error
            res.render('resetPassword', { token: null, error: 'Invalid or expired reset link.' });
            return;
          }

          res.render('resetPassword', {token});
          
        } catch (error) {
          res.sendServerError(error.message);

        }
      }

      const getUserCart = async (req, res) => {
        try {
            console.log("Entró en getUserCart");
    
            // Obtener el usuario actual
            const userId = req.user._id;
    
            // Obtener los carritos del usuario
            const carts = await getUserCarts(userId);
    
            console.log("Carritos obtenidos:", carts);
    
            // Renderizar la vista del carrito con los datos obtenidos
            res.render('userCart', { user: req.user, carts });
        } catch (error) {
          console.error('Error en getUserCart:', error.message); // Cambiado a error.message
          // Manejar el error según tus necesidades
          res.status(500).send(`Error en getUserCart: ${error.message}`);
        }
    };
    

    const comprarProducto = async (req, res) => {
      try {

          console.log("config:"+configs.user, configs.pass)
          console.log('Contenido de req.body:', req.body);
          // Obtener datos del formulario enviado por el cliente
          const price = req.body['precio total'];
          const userEmail = req.body.userEmail;         

  
          // Imprimir en la consola del servidor
          console.log("Correo del usuario:", userEmail);
          console.log("precio total:", price);
  
          const mailOptions = {
            from: configs.user, // Cambia esto al remitente real
            to: userEmail,
            subject: 'Factura de compra',
            html: `<p>Gracias por comprar con nosotros, el total es $ : ${price} </p>`
          };

          // Configura el transporte de nodemailer (usando tu proveedor de correo)
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
              user: configs.mail,
              pass: configs.pass
            }
          });

          // Envía el correo
          await transporter.sendMail(mailOptions);
          // Lógica adicional para la compra
  
          // Responder al cliente si es necesario
          res.status(200).send('Compra exitosa, la factura ha sido enviada a tu correo');
      } catch (error) {
          // Manejar errores según tus necesidades
          res.status(500).send('Error en la compra: ' + error.message);
      }
  };

      export {
        productsView,
        cartsView,
        cartsIdView,
        registerView,
        loginView,
        currentView,
        loggerTest,
        newPassword,
        resetPassword,
        getUserCart,
        comprarProducto
      }