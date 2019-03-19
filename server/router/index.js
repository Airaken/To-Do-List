//requires 
const express = require('express');
const app = express();
//adds routers
app.use(require('./login'));
app.use(require('./user'));
app.use(require('./task'));
// exportes routers
module.exports = app;