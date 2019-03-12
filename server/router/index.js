//requires 
const express = require('express');
const app = express();
//add routers
app.use(require('./login'));
app.use(require('./user'));
app.use(require('./task'));

module.exports = app;