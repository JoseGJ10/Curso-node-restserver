

const validarArchivoSubir = require('../middlewares/validar-archivo')
const validarCampos = require('../middlewares/validar-campos')
const validarJWT  = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivoSubir
}