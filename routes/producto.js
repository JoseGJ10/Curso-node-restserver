const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        productoDelete,
        actualizarProducto } = require('../controllers/producto');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const { validarCampos,validarJWT, esAdminRole } = require('../middlewares/index');


const router = Router();

router.get('/', obtenerProductos )

router.get('/:id',[
    check( 'id' ,'No es un id de Mongo').isMongoId(),
    check( 'id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto )

router.post('/',[ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto )

router.put('/:id',[ 
    validarJWT,
    check( 'id' ,'No es un id de Mongo').isMongoId(),
    check( 'id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto )

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], productoDelete )

module.exports = router;