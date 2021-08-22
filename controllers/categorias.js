const { response } = require('express')
const { Categoria } = require('../models')

const obtenerCategorias = async (req,res=response) => {

    const { limit = 5, from =0 } = req.query
    const query = {estado: true}
    
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number( from ))
        .limit(Number( limit ))]);
        
        res.status(200).json({
        total,
        categorias
    })

}

// obtener categoria - populate {}
const obtenerCategoria = async (req,res=response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

    res.status(200).json( categoria )
}

const crearCategoria = async (req,res=response) =>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ){
        res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    // Generar la Data a Guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data )

    // Guardar DB

    await categoria.save();

    res.status( 201 ).json( categoria )
}

//Actualizar categoria
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const {estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ){
        res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json( { categoria } )

}

const categoriaDelete = async (req, res = response) => {
    
    const { id } = req.params;
    const usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate( id, {estado: false, usuario },{new: true} );

    res.status(200).json({
        categoria
    })

}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    categoriaDelete,
    actualizarCategoria
}