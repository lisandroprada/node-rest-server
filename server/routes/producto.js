const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const Producto = require('../models/producto');

const app = express();

// Obtener todos los productos
app.get('/producto', verificaToken, (req, res) => {

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuanto: conteo
                });
            });
        });
});

app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es valido'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


// Buscar productos
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })
})

// crea un nuevo producto
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

// Modifica Producto
app.put('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: { message: 'ID inválido' }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
})

// Borra un producto
app.delete('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    req.body.disponible = false;

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            message: 'Producto borrado',
            producto: productoBorrado
        });
    });
});

module.exports = app;