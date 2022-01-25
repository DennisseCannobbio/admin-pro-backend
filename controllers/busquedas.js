const { response } = require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario');
const Medico = require('../models/Medicos');
const Hospital = require('../models/Hospital');
const { generarJWT } = require('../helpers/jwt');


const getTodo = async (req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );
    const usuarios = await Usuario.find({ 
            nombre: regex 
    })

    const medicos = await Medico.find({
        nombre: regex
    })

    const hospitales = await Hospital.find({
        nombre: regex
    })

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    })
}

const getDocumentosColeccion = async (req, res = response) => {

    const busqueda = req.params.busqueda;
    const tabla = req.params.tabla;
    const regex = new RegExp( busqueda, 'i' );

    let data = [];

    switch (tabla) {
        case 'medicos':

            data = await Medico.find({ nombre: regex })
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre img');
            
            break;

        case 'hospitales':
            
            data = await Hospital.find({ nombre: regex })
                                    .populate('usuario', 'nombre img')
            
            break;

        case 'usuarios':
            
            data = await Usuario.find({ nombre: regex })
                                    .populate('usuario', 'nombre img');

            break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla debe ser usuarios/medicos/hospitales'
            });
    }

    res.json({
        ok: true,
        resultados: data
    })
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}