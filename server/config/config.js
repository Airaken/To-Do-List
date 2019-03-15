// Port
process.env.PORT = process.env.PORT || 3000;
// Data Base
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// chois 
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/test-Condor'
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;
// SEED of authentication
process.env.SEED = process.env.SEED || 'SEED-ENV';
// Token
process.env.TOKEN = process.env.TOKEN || '';