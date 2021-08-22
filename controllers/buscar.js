const { response } = require('express')
const { ObjectId } =require('mongoose').Types
const { User , Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params

    if ( !coleccionesPermitidas.includes ( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion){
        case 'usuarios':
            buscarUsuarios(termino,res)
            break;
        case 'categorias':
            buscarCategorias(termino,res)
            break;
        case 'productos':
            buscarProductos(termino,res)
            break;
        default:
            res.status(500).json({
                msg: 'No esta desarrollada esta busqueda'
            })
    }

}


const buscarCategorias = async (termino ='', res = response) => {
    
    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ){
        const categoria = await Categoria.findById( termino )
        return res.status(200).json( {results:  ( categoria ) ? [ categoria ] : [] } )
    }

    const regex = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({nombre: regex, estado: true})

    res.status(200).json( {results:  ( categorias ) ? [ categorias ] : [] } )

}

const buscarProductos = async (termino ='', res = response) => {
    
    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ){
        const producto = await Producto.findById( termino ).populate('categoria','nombre')
        return res.status(200).json( {results:  ( producto ) ? [ producto ] : [] } )
    }

    const regex = new RegExp( termino, 'i' );

    const productos = await Producto.find({nombre: regex, estado: true}).populate('categoria','nombre')

    res.status(200).json( {results:  ( productos ) ? [ productos ] : [] } )

}

const buscarUsuarios = async (termino ='', res = response) => {
    
    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ){
        const usuario = await User.findById( termino )
        return res.status(200).json( {results:  ( usuario ) ? [ usuario ] : [] } )
    }

    const regex = new RegExp( termino, 'i' );

    const usuarios = await User.find({
        $or: [{ nombre: regex},{correo: regex}],
        $and: [{estado: true }]
    })

    res.status(200).json( {results:  ( usuarios ) ? [ usuarios ] : [] } )

}

module.exports = {
    buscar
}