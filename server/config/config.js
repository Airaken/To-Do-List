// Port
process.env.PORT = process.env.PORT || 3000;
// Data Base local or mLab
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// Chois url, local or mLab
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/test-Condor'
} else {
    urlDB = process.env.MONGO_URI;
}
//asign url
process.env.URLDB = urlDB;
// SEED of authentication
process.env.SEED = process.env.SEED || 'SEED-ENV';
// Token
process.env.TOKEN = process.env.TOKEN || '';