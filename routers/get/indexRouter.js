const express = require('express');
const { resolve } = require('path');

const indexRouter = new express.Router();

/************************ get ***********************/
indexRouter.get('/', (request, response) => {
    response.sendFile(resolve(__dirname, '../../templates/login.html'));
});

indexRouter.get('/login', (request, response) => {
    response.sendFile(resolve(__dirname, '../../templates/login.html'));
});

indexRouter.get('/register', (request, response) => {
    response.sendFile(resolve(__dirname, '../../templates/register.html'));
});

indexRouter.get('/home', (request, response) => {
    response.sendFile(resolve(__dirname, '../../templates/home.html'));
});

module.exports = indexRouter;