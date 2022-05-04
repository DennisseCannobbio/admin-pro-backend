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

const actualizarMedico = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const medicodb = await Medico.findById(id);

        if(!medicodb) {
            return res.status(400).json({
                ok: false,
                msg: 'Medico no encontrado'
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true })

        res.json({
            ok: true,
            medico: medicoActualizado
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
            error
        })
    }


}

const borrarMedico = async (req, res = response) => {

    const id = req.params.id;

    try {
        
        const medicodb = await Medico.findById(id);

        if(!medicodb) {
            return res.status(400).json({
                ok: false,
                msg: 'Medico no encontrado'
            })
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Medico eliminado correctamente'
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
            error
        })
    }


}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}