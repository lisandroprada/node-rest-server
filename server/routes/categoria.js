const express = require('express');
const _ = require('underscore');
let Categoria = require('../models/categoria');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();



// Mostrar todas las categorías
app.get('/categoria', (req, res) => {

    let fitro = { estado: true };

    Categoria.find(fitro)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments(fitro, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuanto: conteo
                });
            });
        });
});

// Mostrar una categoría por ID
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es valido'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

// Crea una nueva categoría
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// Modifica categoría
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

// // Borra categoría
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    req.body.estado = false;

    Categoria.findOneAndUpdate(id, body, { new: true }, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrada"
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoría borrada',
            categoria: categoriaBorrada
        });
    })

});



module.exports = app;