const { response } = require('express')
const { Producto } = require('../models')

const obtenerProductos = async (req,res=response) => {

    const { limit = 5, from =0 } = req.query
    const query = {estado: true}
    
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number( from ))
        .limit(Number( limit ))]);
        
        res.status(200).json({
        total,
        productos
    })

}

const obtenerProducto = async (req,res=response) => {
    const { id } = req.params;
    const producto = await Producto.findById( id ).populate('usuario', 'nombre').populate('categoria', 'nombre');

    res.status(200).json( producto )
}

const crearProducto = async (req,res=response) =>{

    const { estado, usuario, ...body } = req.body
    
    const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

    if ( productoDB ){
        res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    // Generar la Data a Guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data )

    // Guardar DB

    await producto.save();

    res.status( 201 ).json( producto )
}

const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const {estado, usuario, ...data } = req.body;

    if ( data.nombre ){
        data.nombre = data.nombre.toUpperCase()

        const productoDB = await Producto.findOne({ nombre: data.nombre });

        if ( productoDB ){
            res.status(400).json({
                msg: `La producto ${ productoDB.nombre }, ya existe`
            });
        }
    }
    
    data.usuario = req.usuario._id

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json( { producto } )

}

const productoDelete = async (req, res = response) => {
    
    const { id } = req.params;
    const usuario = req.usuario._id

    const producto = await Producto.findByIdAndUpdate( id, {estado: false, usuario },{new: true} );

    res.status(200).json({
        producto
    })

}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    productoDelete,
    actualizarProducto
}