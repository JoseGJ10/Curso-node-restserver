const dbValidator = require('./db-validators')
const generarJWT = require('./generar-jwt')
const googleVerify = require('./google-verify')
const subirArchivo = require('./subirArchivo')


module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}