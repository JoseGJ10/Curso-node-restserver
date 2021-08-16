
const { response } = require('express')

const usuariosGet = (req, res = response) => {
    
    const { q, nombre = 'no name', apikey, page= 1, limit } = req.query;

    res.json({
        msg: "get API desde el controlador",
        q,
        nombre,
        apikey,
        page,
        limit
    })

}

const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: "Post API desde el controlador",
        nombre,
        edad
    })

}

const usuariosPut = (req, res = response) => {

    const { id } = req.params

    res.json({
        msg: "Put API desde el controlador",
        id
    })

}

const usuariosPatch = (req, res = response) => {
    
    res.json({
        msg: "Patch API desde el controlador"
    })

}

const usuariosDelete = (req, res = response) => {
    
    res.json({
        msg: "Delete API desde el controlador"
    })

}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}