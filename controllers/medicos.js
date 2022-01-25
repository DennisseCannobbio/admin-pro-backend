const { response } = require('express');
const bcrypt = require('bcryptjs')
const Medico = require('../models/Medicos');
const { generarJWT } = require('../helpers/jwt');

const getMedicos = async (req, res = response) => {

    const medico = await Medico.find()
                                .populate('usuario', 'nombre email img')
                                .populate('hospital', 'nombre img')

    res.json({
        ok: true,
        medico
    })
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const actualizarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarMedico'
    })
}

const borrarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarMedico'
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}