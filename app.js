const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const joi = require('joi');

const app = express();

const signatureRoutes = require('./routes/signature');

app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/signature',signatureRoutes);
app.use('/', signatureRoutes);


app.use(function (req, res, next) {
    const err = new Error('Stranica ne postoji: ' + req.url);
    err.status = 404;
    next(err);
})

module.exports = app;