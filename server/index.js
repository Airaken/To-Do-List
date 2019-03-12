require('./config/config');

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

//Config routers
app.use(require('./router/index'));

//connect with mongo
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Data Base Online');
});

//listen server
app.listen(process.env.PORT, () => {
    console.log('Listen on port ', process.env.PORT);
});