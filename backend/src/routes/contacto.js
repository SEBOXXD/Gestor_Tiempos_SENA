/**
 * ====================================================================
 * ARCHIVO: contacto.js
 * ====================================================================
 * Ruta para envío de correos electrónicos de contacto.
 *
 * Este módulo NO utiliza la base de datos. Usa Nodemailer para
 * enviar correos electrónicos desde el formulario de contacto
 * del frontend.
 *
 * Configuración de Nodemailer:
 *   Se usa Gmail como servicio SMTP. Las credenciales se
 *   obtienen de las variables de entorno:
 *     - EMAIL_USER    → Correo remitente
 *     - EMAIL_PASS    → Contraseña de aplicación de Gmail
 *
 * Para que funcione con Gmail, se necesita:
 *   1. Activar la verificación en 2 pasos en la cuenta de Google
 *   2. Crear una "Contraseña de aplicación" en la configuración
 *      de seguridad de la cuenta
 *   3. Usar esa contraseña en EMAIL_PASS (NO la contraseña normal)
 *
 * Endpoints:
 *   POST /api/contacto → Enviar correo de contacto
 * ====================================================================
 */

const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

module.exports = function () {

  /**
   * Configuración del transportador de correo.
   *
   * Si las variables de entorno no están configuradas, se usa
   * un transportador de prueba (Ethereal) que simula el envío.
   * Esto permite desarrollo sin credenciales reales.
   */
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  /**
   * POST /api/contacto
   * ------------------------------------------------------------------
   * Envía un correo electrónico de contacto.
   *
   * Body esperado:
   *   {
   *     "nombre": "Juan Perez",
   *     "correo": "juan@mail.com",
   *     "asunto": "Soporte técnico",
   *     "mensaje": "Necesito ayuda con..."
   *   }
   *
   * Flujo:
   *   1. Valida que todos los campos obligatorios estén presentes
   *   2. Configura el correo con los datos del formulario
   *   3. Envía el correo usando Nodemailer
   *
   * Respuestas:
   *   200 → Correo enviado exitosamente
   *   400 → Faltan campos obligatorios
   *   500 → Error al enviar el correo
   * ------------------------------------------------------------------
   */
  router.post('/', async (req, res) => {
    try {
      const { nombre, correo, asunto, mensaje } = req.body;

      // Validar que todos los campos obligatorios estén presentes
      if (!nombre || !correo || !asunto || !mensaje) {
        return res.status(400).json({
          error: 'Todos los campos son obligatorios: nombre, correo, asunto, mensaje'
        });
      }

      // Configurar el contenido del correo
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@gestor-tiempos.com',
        to: process.env.EMAIL_USER || 'admin@gestor-tiempos.com', // Se envía a la misma cuenta
        replyTo: correo, // El destinatario puede responder directamente al usuario
        subject: `[Gestor Tiempos SENA] ${asunto}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              Nuevo mensaje de contacto
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555; width: 120px;">Nombre:</td>
                <td style="padding: 8px; color: #333;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">Correo:</td>
                <td style="padding: 8px; color: #333;">
                  <a href="mailto:${correo}">${correo}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">Asunto:</td>
                <td style="padding: 8px; color: #333;">${asunto}</td>
              </tr>
            </table>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
              <h3 style="margin-top: 0; color: #333;">Mensaje:</h3>
              <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${mensaje}</p>
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              Este correo fue enviado desde el formulario de contacto del Gestor de Tiempos SENA.
            </p>
          </div>
        `
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);

      res.json({
        success: true,
        mensaje: 'Correo enviado exitosamente. Nos pondremos en contacto pronto.'
      });
    } catch (err) {
      // Si falla el envío (credenciales incorrectas, servidor caído, etc.)
      res.status(500).json({
        error: 'Error al enviar el correo. Por favor intente de nuevo más tarde.',
        detalle: err.message
      });
    }
  });

  return router;
};
