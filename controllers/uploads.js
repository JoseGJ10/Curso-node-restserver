

const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { User, Producto } = require('../models');

const cargarArchivo = async (req,res = response )=> {
  
    try {
      
      // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' )
      const nombre = await subirArchivo( req.files, undefined, 'imgs' )
      
      res.json({ nombre })

    }catch( msg ){

      res.status(400).json({ msg })

    }
    
}

const actualizarImagen = async (req, res = response ) => {

  const {id, coleccion } = req.params

  let modelo;

  switch ( coleccion ){
    case 'usuarios':
        modelo = await User.findById( id );
        if( !modelo ){
          return res.status(400).json({
            msg: `No exsiste un usuario con el id ${id}`
          })
        }
        break;

    case 'productos':
      modelo = await Producto.findById(id);
        if( !modelo ){
          return res.status(400).json({
            msg: `No exsiste un producto con el id ${id}`
          })
        }
        break;

    default:
      return res.status(500).json('Proceso no desarrollado aún')
  }

  // Limpiar imágenes propias
  if ( modelo.img ){
      // Borrar imagen del servidor.
      const pathImagen = path.join( __dirname , '../uploads' , coleccion, modelo.img )
      if (fs.existsSync( pathImagen )){
          fs.unlinkSync( pathImagen );
      }
  }

  const nombre = await subirArchivo( req.files, undefined, coleccion)
  modelo.img = nombre;

  await modelo.save();

  res.json( modelo );

}

const mostrarImagen = async (req,res) => {

    const { id, coleccion } = req.params;
    
    let modelo;

    switch ( coleccion ){
      case 'usuarios':
          modelo = await User.findById( id );
          if( !modelo ){
            return res.status(400).json({
              msg: `No exsiste un usuario con el id ${id}`
            })
          }
          break;
  
      case 'productos':
        modelo = await Producto.findById(id);
          if( !modelo ){
            return res.status(400).json({
              msg: `No exsiste un producto con el id ${id}`
            })
          }
          break;
  
      default:
        return res.status(500).json('Proceso no desarrollado aún')
    }
  
    // Limpiar imágenes propias
    if ( modelo.img ){
        // Borrar imagen del servidor.
        const pathImagen = path.join( __dirname , '../uploads' , coleccion, modelo.img )
        if (fs.existsSync( pathImagen )){
            return res.sendFile( pathImagen )
        }
    }
  
    const NoImagen = path.join(__dirname,'../assets/No-image-found.jpg');
    if (fs.existsSync( NoImagen )){
      return res.sendFile( NoImagen )
    }
   
    

}

const actualizarImagenCloudinary = async (req, res = response ) => {

  const {id, coleccion } = req.params

  let modelo;

  switch ( coleccion ){
    case 'usuarios':
        modelo = await User.findById( id );
        if( !modelo ){
          return res.status(400).json({
            msg: `No exsiste un usuario con el id ${id}`
          })
        }
        break;

    case 'productos':
      modelo = await Producto.findById(id);
        if( !modelo ){
          return res.status(400).json({
            msg: `No exsiste un producto con el id ${id}`
          })
        }
        break;

    default:
      return res.status(500).json('Proceso no desarrollado aún')
  }

  // Limpiar imágenes propias
  if ( modelo.img ){
      // Borrar imagen del servidor.
      const nombreArr = modelo.img.split('/');
      const nombre = nombreArr[ nombreArr.length - 1 ]
      const [ public_id ] = nombre.split('.')
      cloudinary.uploader.destroy( public_id );
  }
  const { tempFilePath } = req.files.archivo
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

  /* const nombre = await subirArchivo( req.files, undefined, coleccion)*/
  modelo.img = secure_url;

  await modelo.save(); 

  res.json( modelo ); 

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}