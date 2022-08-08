const express = require('express');
const rest = express();
const router = express.Router();
const userController = require('../controllers/userController');


rest.get('/users/:id/resttasks',userController.viewrestTasks);
rest.get('/users/:id/teamtasks',userController.teamandtasks);
module.exports = rest;