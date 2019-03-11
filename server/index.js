//import packages
const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;
let server = http.createServer(app);

//static files
app.use(express.static(publicPath));

//server run
server.listen(port, (err) => {
    if (err) throw new Error(err);
    console.log(`Server run on port ${port}`);
});