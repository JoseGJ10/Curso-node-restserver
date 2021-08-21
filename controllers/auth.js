const { response } = require('express');
const User = require('../models/user')
const bcriptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSigin = async (req,res=response)=>{

    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleVerify( id_token )

        let usuario = await User.findOne( { correo } );

        if ( !usuario ){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ';P',
                img,
                google: true
            };

            usuario = new User( data )
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        res.status(200).json({
            msg: 'Todo ok! Google SingIn',
        })

    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }


}

module.exports = {
    login,
    googleSigin
}