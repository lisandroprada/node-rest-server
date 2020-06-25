// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del token
// 60 segundos x 60 minutos
process.env.CADUCIDAD_TOKEN = '48h';

// Seed
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '804033958350-2qtss2afvj7id6ktv6tgu3l48lmg2moh.apps.googleusercontent.com';

// Base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;