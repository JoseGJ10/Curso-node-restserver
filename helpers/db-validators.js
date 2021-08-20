const Role = require('../models/rol')
const User = require('../models/user')

const esRoleValido = async  (rol='') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ){
        throw new Error(`el rol ${rol} no esta incluido en la BBDD`)
    }
}

const emailExiste = async (correo = '' ) => {
    const existeMail = await User.findOne( { correo } );
    if ( existeMail ) {
        throw new Error(`El correo ${ correo }, ya esta dado de alta en la BBDD`)
    }
}

const usuarioExistePorId = async ( id ) => {
    const existeUsuario = await User.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`No existe id: ${id} en la BBDD.`)
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    usuarioExistePorId
}
