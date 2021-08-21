const { response } = require('express');
const User = require('../models/user')
const bcriptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req,res = response) => {

    const { correo, password } = req.body;

    try{
        // Verificar si el email existe
        const usuario = await User.findOne({ correo })
        if(!usuario){
            res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        // Si el usuario esta activo
        if(!usuario.estado){
            res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        // Verificar contraseña

        const validPassword = bcriptjs.compareSync( password, usuario.password);
        if(!validPassword){
            res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
        
    }catch (error){
        return res.status(500).json({
            msg: 'Error hable con el administrador'
        })
    }

    
}

module.exports = {
    login
}