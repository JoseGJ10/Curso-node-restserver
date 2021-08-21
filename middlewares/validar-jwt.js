const { response } = require('express')
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const validarJWT = async (req,res = response, next ) => {
    
    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay un token en la petición'
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVETEKEY)
        
        const usuario = await user.findById( uid )

        if ( !usuario ) {
            res.status(401).json('Token no válido - usuario no existe en BBDD')
        }

        if ( !usuario.estado ) {
            res.status(401).json('Token no válido - usuario con estado: false')
        }

        req.usuario = usuario;
        
        next()
        
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

    

}

module.exports = {
    validarJWT
}