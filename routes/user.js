const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares/index')

const { esRoleValido, emailExiste, usuarioExistePorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/user');


const router = Router();

router.get('/', usuariosGet )

router.put('/:id',[
        check('id', 'No es un Id Valido').isMongoId(),
        check('id').custom( usuarioExistePorId ),
        check('rol').custom( esRoleValido ),
        validarCampos
],usuariosPut )

router.post('/',[
        check('nombre','El Nombre es obligatorio').not().isEmpty(),
        check('password','El password debe de ser más de 6 letras').isLength({min: 6}),
        check('correo').custom( emailExiste ),
        check('rol').custom( esRoleValido ),
        validarCampos
],usuariosPost )

router.delete('/:id',[
        validarJWT,
        // esAdminRole,
        tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
        check('id', 'No es un Id Valido').isMongoId(),
        check('id').custom( usuarioExistePorId ),
        validarCampos
],usuariosDelete )

router.patch('/', usuariosPatch )

module.exports = router;