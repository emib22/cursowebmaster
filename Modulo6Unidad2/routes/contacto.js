var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var contactoModel = require('../models/contactoModel');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('contacto', { title: 'Emiliano' });
});

router.post('/', async (req, res, next) => {

    //console.log(req.body)

    var nombre = req.body.nombre;
    var email = req.body.email;
    var mensaje = req.body.mensaje;

    var obj = {
        to: 'emilianoboccio97@gmail.com',
        subject: 'Contacto desde la Web',
        html: nombre + " se contacto a travez de la web y quiere mas info a este correo:" + email + "<br> Además. nos dejó el siguiente comentario: " + mensaje
    }

    var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    })

    var info = await transporter.sendMail(obj);
    var contacto = await contactoModel.insertContacto(req.body)// guarda en BD

    res.render('contacto', {
        message: 'mensaje enviado correctamente'
    });
})

module.exports = router;