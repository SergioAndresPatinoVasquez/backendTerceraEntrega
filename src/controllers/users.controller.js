import {
  generateToken,
  isValidPassword,
  generateUsers
} from "../utils.js";
import {
  getByemailLogin as getByemailLoginServices,
  getByemailRegister as getByemailRegisterServices,
  saveServices,
  passwordChangedService,
  changeUserRoleService,
  updateLastConnection,
  uploadDocuments as uploadDocumentsService,
  getAllUsersService,
  deleteInactiveUsersService
} from '../services/users.service.js';
import CustomError from '../middlewares/errors/customError.js';
import EErrors from '../middlewares/errors/enums.js';
import nodemailer from 'nodemailer';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';
import {
  checkRequiredDocumentsMiddleware
} from '../middlewares/premium.js';
import UsersDto from '../DTOs/users.dto.js';
import configs from "../config/config.js";


// Crea el transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.mail,
    pass: config.pass
  }
});

const login = async (req, res, next) => {
  try {
    console.log("entra a login")
    const {
      email,
      password
    } = req.body
    if (!email || !password) {
      throw CustomError.createError({
        name: 'UserError',
        cause: 'Incomplete values',
        message: 'Error trying to login user',
        code: EErrors.INVALID_TYPE_ERROR
      })
    }

    const user = await getByemailLoginServices(email);
    if (!user) {
      throw CustomError.createError({
        name: 'UserError',
        cause: 'incorrect credential',
        message: 'Error trying to login user by email',
        code: EErrors.INVALID_TYPE_ERROR
      })
    }

    const comparePassword = isValidPassword(password, user.password);

    if (!comparePassword) {
      throw CustomError.createError({
        name: 'UserError',
        cause: 'incorrect credential',
        message: 'Error trying to login user by password',
        code: EErrors.INVALID_TYPE_ERROR
      })
    }
    // Advertencia si el usuario no tiene contraseña
    if (!user.password) {
      req.logger.warning(`User ${user.email} does not have a password.`);
    }

    const userId = user._id;

    //eliminado el password de las cookies
    const {
      password: _,
      ...userResult
    } = user

    await updateLastConnection(user._id);

    const accessToken = generateToken(userResult, '24h');
    req.logger.info(`AccessToken created successfully ${accessToken}`)
    res.cookie('coderCookieToken', accessToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true
    }).send({
      status: 'success',
      message: 'login success'
    })
    //res.sendSuccess(accessToken);       

  } catch (error) {
    req.logger.error(`Error in login: ${error.message}`, {
      error
    });

    next(error);
  }
};



const register = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      age,
      role,
      password
    } = req.body;

    // Agrega la lógica de validación según tus necesidades
    if (!first_name || !last_name || !email || !age || !role || !password) {
      throw CustomError.createError({
        name: 'UserError',
        cause: 'Incomplete values',
        message: 'Error trying to register user',
        code: EErrors.INVALID_TYPE_ERROR
      })
    }

    const existsUser = await getByemailRegisterServices(email);

    if (existsUser) {

      throw CustomError.createError({
        name: 'UserError',
        cause: 'user already exists',
        message: 'Error trying to register user',
        code: EErrors.INVALID_TYPE_ERROR
      })
    }

    const result = await saveServices(first_name, last_name, email, age, role, password);

    const accessToken = generateToken(result, '24h');
    res.status(201).json({
      status: 'success',
      access_token: accessToken
    });

  } catch (error) {
    req.logger.error(`Error in register: ${error.message}`, {
      error
    });

    next(error);
  }
};



const sendPasswordResetLink = async (req, res, next) => {
  try {
    const {
      email
    } = req.body
    if (!email) {
      throw CustomError.createError({
        name: 'UserError',
        cause: 'Incomplete values',
        message: 'Error trying to login user',
        code: EErrors.INVALID_TYPE_ERROR
      })
    }

    const user = await getByemailLoginServices(email);

    console.log("ingreso si señor", user)

    if (!user) {
      throw CustomError.createError({
        name: 'UserError',
        cause: 'incorrect credential',
        message: 'Error trying to login user by email',
        code: EErrors.INVALID_TYPE_ERROR
      })
    }

    // Genera un token con la información del usuario
    const token = generateToken({
      email: user.email,
      password: user.password
    }, '1h');

    // Configura una cookie con el token en el navegador del usuario
    res.cookie('passwordResetToken', token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true
    });

    // Aquí puedes enviar el enlace de restablecimiento de contraseña por correo electrónico o realizar otras acciones necesarias
    // Envía el enlace de restablecimiento de contraseña por correo electrónico
    const resetLink = `http://localhost:8080/reset-password?token=${token}`;
    const mailOptions = {
      from: email, // Cambia esto al remitente real
      to: config.mail,
      subject: 'Restablecimiento de Contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`
    };

    // Configura el transporte de nodemailer (usando tu proveedor de correo)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: config.mail,
        pass: config.pass
      }
    });

    // Envía el correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent successfully'
    });



  } catch (error) {
    req.logger.error(`Error in login: ${error.message}`, {
      error
    });

    next(error);
  }
};

const passwordChanged = async (req, res) => {
  try {
    // Recuperar el token de la cookie
    const resetToken = req.cookies.passwordResetToken;

    // Verificar si el token existe
    if (!resetToken) {
      throw new Error('Token not found');
    }

    // Decodificar y validar el token para obtener la información
    let emailFromToken;
    const decodedToken = jwt.verify(resetToken, config.jwt_key);
    emailFromToken = decodedToken.user.email;

    // Recuperar la contraseña del cuerpo de la solicitud
    const {
      password
    } = req.body;

    console.log("email from token", emailFromToken);
    console.log("contraseña", password);

    // Llamar al servicio para manejar la lógica de cambio de contraseña
    await passwordChangedService(emailFromToken, password);

    res.redirect('/login');

  } catch (error) {
    console.error("Error during password change:", error);
    res.sendServerError(error.message);
  }
};


const changeUserRole = async (req, res) => {
  try {
    const userId = req.params.uid;

    // Llamada al middleware para verificar los documentos
    await new Promise((resolve, reject) => {
      checkRequiredDocumentsMiddleware(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Llamada al servicio para cambiar el rol
    const result = await changeUserRoleService(userId);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};


const usersMocking = async (req, res) => {
  let users = [];

  for (let i = 0; i < 100; i++) {
    users.push(generateUsers());
  }

  res.send({
    status: 'ok',
    counter: users.length,
    data: users
  });
}


const uploadDocuments = async (req, res, next) => {
  try {
    const userId = req.params.uid;

    // Verificar si hay archivos en la solicitud
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        error: 'No se han subido archivos.'
      });
    }

    // Obtener el nombre del primer archivo subido
    const filename = req.files[0].filename;

    const document = req.body; // Obtén el objeto que vamos a insertar

    if (!document.name) {
      return res.status(400).json({
        status: 'error',
        error: 'Valores incompletos: se requiere el campo "name".'
      });
    }


    if (!filename) {
      return res.status(500).json({
        status: 'error',
        error: 'No se han subido archivos.'
      });
    }

    const result = await uploadDocumentsService(userId, document, filename);

    res.status(200).json({
      message: 'Documentos subidos exitosamente.',
      user: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al subir documentos.'
    });
  }
};


const getAllUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios desde el servicio
    const users = await getAllUsersService();

    // Mapear los usuarios a DTO
    const usersDto = users.map(user => new UsersDto(user));

    // Responder con los usuarios DTO
    res.json({
      status: 'success',
      data: usersDto
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      error: 'Error al obtener usuarios.'
    });
  }
}

const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); // Resta 30 minutos a la fecha actual


const deleteInactiveUsers = async (req, res) => {
  try {
    // Asegúrate de convertir el objeto a una fecha válida
    const lastConnectionThreshold = new Date(thirtyMinutesAgo);

    // Verifica si lastConnectionThreshold es un objeto Date o es convertible a Date
    if (!(lastConnectionThreshold instanceof Date) && isNaN(Date.parse(lastConnectionThreshold))) {
      throw new Error('El parámetro lastConnectionThreshold no es un objeto Date válido.');
    }

    // Crear una instancia de UsersController
    const usersController = new UsersController();

    // Eliminar usuarios que no se han conectado en los últimos 30 minutos
    const {
      deletedUsers
    } = await deleteInactiveUsersService(lastConnectionThreshold);

    // Enviar correos electrónicos a los usuarios eliminados
    for (const user of deletedUsers) {
      const userEmail = user.email;
      await usersController.sendDeletionEmail(userEmail);
    }

    res.json({
      status: 'success',
      message: `${deletedUsers.length} usuarios eliminados.`,
      deletedUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      error: 'Error al eliminar usuarios inactivos.'
    });
  }
};

class UsersController {
  // ... (Otras funciones y propiedades de la clase)

  // Función para enviar correo de eliminación
  sendDeletionEmail = async (userEmail) => {
    try {
      
      await transporter.sendMail({
        from: 'Coder',
        to: userEmail,
        subject: 'Cuenta eliminada por inactividad',
        html: `<div><h1>Tu cuenta (${userEmail}) ha sido eliminada por inactividad.</h1></div>`,
        attachments: []
      });
    } catch (error) {
      console.error(`Error al enviar el correo de eliminación: ${error.message}`);
      throw new Error(`Error al enviar el correo de eliminación: ${error.message}`);
    }
  }

  // Resto de las funciones de la clase
}


export {
  login,
  register,
  usersMocking,
  sendPasswordResetLink,
  passwordChanged,
  changeUserRole,
  uploadDocuments,
  getAllUsers,
  deleteInactiveUsers

}
