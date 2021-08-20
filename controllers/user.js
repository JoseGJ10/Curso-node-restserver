
const { response } = require('express');
const bcrypjs = require('bcryptjs');
const User = require('../models/user');
const { Promise } = require('mongoose');



const usuariosGet = async (req, res = response) => {
    
    const { limit = 5, from =0 } = req.query
    const query = {estado: true}
    
    const [ total, usuarios ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number( from ))
        .limit(Number( limit ))]);
        
    res.json({
        total,
        usuarios
    })

}

const usuariosPost = async (req, res = response) => {

    const {nombre, correo, password, rol } = req.body;
    const user = new User( { nombre, correo, password, rol } )

    // Encriptar la contraseña
    const salt = bcrypjs.genSaltSync();
    user.password = bcrypjs.hashSync( password, salt)

    //Guardar la BBDD
    await user.save();

    res.json({
        user
    })

}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params
    const { _id, password, google, correo,...resto } = req.body

    // TODO validar contra base de datos
    if ( password ) {
       // Encriptar la contraseña
        const salt = bcrypjs.genSaltSync();
        resto.password = bcrypjs.hashSync( password, salt) ;
    }

    const usuario = await User.findByIdAndUpdate(id, resto);

    res.json({usuario})

}

const usuariosPatch = (req, res = response) => {
    
    res.json({
        msg: "Patch API desde el controlador"
    })

}

const usuariosDelete = async (req, res = response) => {
    
    const { id } = req.params;

    // Fisiacamente lo Borramos
    // const usuario = await User.findByIdAndDelete ( id )

    const usuario = await User.findByIdAndUpdate( id, {estado: false } );

    res.json({
        usuario
    })

}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}