const express = require('express');
const rest = express();
const router = express.Router();
const userController = require('../controllers/userController');

function logger(req,res,next){
    console.log('Log');
    next();
}