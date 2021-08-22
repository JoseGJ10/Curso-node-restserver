const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        categoriaDelete,
        actualizarCategoria } = require('../controllers/categorias');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarCampos,validarJWT, esAdminRole } = require('../middlewares/index');


const router = Router();

/**
 *  {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias )

// Obtener una categoria por id - publico
router.get('/:id',[
    check( 'id' ,'No es un id de Mongo').isMongoId(),
    check( 'id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria )

//Crear Categoria - privado - cualquier persona con un token valido.
router.post('/',[ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria )

//Actualizar  - privado - cualquier persona con un token valido.
router.put('/:id',[ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check( 'id' ,'No es un id de Mongo').isMongoId(),
    check( 'id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria )

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id de Mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], categoriaDelete )


module.exports = router;