const jwt = require('jsonwebtoken');


// Verificación del token

let verificaToken = ((req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
});

// Verificación del admin_ROLE
let verificaAdminRole = ((req, res, next) => {
    let usuario = req.usuario;
    let role = usuario.role;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            message: 'El usuario debe ser administrador'
        });
    }
    next();
});

// Verifica Token para Imagen
let verificaTokenImg = ((req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
})

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
};