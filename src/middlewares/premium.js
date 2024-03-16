
//AUN NO FUNCIONA
//CUARTA PRACTICA INTEGRADORA CLASE 44
//ULTIMO PUNTO

import path from 'path';
import fs from 'fs/promises';

export const checkRequiredDocumentsMiddleware = async (req, res, next) => {
    try {
        const userId = req.params.uid;

        // Obtén la ruta del directorio actual del módulo
        const currentModuleDir = path.dirname(new URL(import.meta.url).pathname);

        // Construye la ruta del directorio de documentos
        const documentPath = path.resolve(process.cwd(), 'src/public/img/documents');


        // Agrega un mensaje de registro para verificar la ruta
        console.log("Ruta del documento:", documentPath);

        // Array de nombres de documentos requeridos
        const requiredDocuments = ['identificacion', 'comprobante de domicilio', 'comprobante de estado de cuenta'];

        for (const documentName of requiredDocuments) {
            const fileName = `${userId.trim()}-${documentName}`;
            const fullPath = path.join(documentPath, fileName);

            // Agrega un mensaje de registro para verificar la ruta
            console.log("Ruta completa del documento:", fullPath);

        // Verifica si el archivo existe y obtén información sobre el archivo
        try {
            await fs.access(fullPath, fs.constants.F_OK);
            // Aquí puedes verificar más detalles sobre el archivo si es necesario
        } catch (err) {
            // Agrega un mensaje de registro para verificar el error
            console.error(`Error al verificar el archivo ${fileName}:`, err);
            return res.status(400).json({ status: 'error', error: `Falta el documento requerido: ${documentName}` });
        }
        }

        // Si todos los documentos están presentes, llamas a next()
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error en el middleware de documentos requeridos.' });
    }
};
