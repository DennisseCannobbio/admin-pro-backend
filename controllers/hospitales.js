const { response } = require('express');
const bcrypt = require('bcryptjs')
const Hospital = require('../models/Hospital');
const { generarJWT } = require('../helpers/jwt');

const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find().populate('usuario', 'nombre email img');

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital( {
        usuario: uid,
        ...req.body
    });
    
    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }


}

const actualizarHospital = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        
        const hospitaldb = await Hospital.findById(id);

        if(!hospitaldb) {
            return res.status(400).json({
                ok: false,
                msg: 'Hospital no encontrado'
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true})

        res.json({
            ok: true,
            hospital: hospitalActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
            error
        })
    }

}

const borrarHospital = async (req, res = response) => {

    const id = req.params.id;

    try {

        const hospitaldb = await Hospital.findById(id);

        if(!hospitaldb) {
            return res.status(400).json({
                ok: false,
                msg: 'Hospital no encontrado'
            })
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital eliminado correctamente'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}