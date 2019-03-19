//add env config
require('./config/config');
//requires 
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// files static
app.use(express.static(path.resolve(__dirname, '../public')));

// add the request of server
app.use(require('./router/index'));

//connect with mongoDB
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Data Base Online');
});

//listen server
app.listen(process.env.PORT, () => {
    console.log('Listen on port ', process.env.PORT);
});