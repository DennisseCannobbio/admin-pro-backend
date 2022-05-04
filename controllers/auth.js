const bcrypt = require('bcryptjs');
const { response } = require('express');
const { googleVerify } = require('../helpers/google-verify');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Verificar password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if( !validPassword ){
            return res.status(404).json({
                ok: false,
                msg: 'Password no válida'
            });
        }
        
        // Generar Token
        const token = await generarJWT( usuarioDB.id );


        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {

        const {name, email, picture} = await googleVerify( googleToken );

        // Verificar si existe un usuario con el email

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if(!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true,
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        const token = await generarJWT(usuario.id); 

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        })
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Generar el token
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    })

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}