const express = require('express');
const app = express();
const router = express.Router();
var cookieParser = require('cookie-parser');
app.use(cookieParser())
app.use(cors);
const userController = require('../controllers/userController');
// rest.use(express.cookieParser());

function cors(req,res,next){
    // console.log('log '+req.url+" ");
    // request method->URL->body done
    // if URL undefined => skip done
    // if cookie is prsent -> authentication
    // if cookies->id != urlUserId => 
    // console.log(req.url +" and "+typeof req.method);
    res.header('Access-Control-Allow-Origin', '*');
    // if(typeof req.url !== 'undefined' && typeof req.method !== 'undefined'){
    //     console.log('log '+req.method+" "+req.url);
    //     if(req.method == 'POST'){
    //         console.log(req.body);
    //     }
    //     console.log('URL id is: '+req.params.userid+" CookieId is: "+req.cookies['authCookie']);
    // }
    next();
}
// WebControllers 
app.get('/users/signup',userController.signup);
app.get('/users/signin',userController.signin);
app.get('/users/:id/tasks',userController.viewTasks);
app.get('/tasks/:id',userController.viewTasksOnly);
app.get('/users/:id/tasks/:tid',userController.edit);
app.get('/users/:id',userController.managerHome);
app.get('/users/:id/team-tasks',userController.teamTasks);
app.get('/logout',userController.logout);
// app.get('/debug/users',userController.userDetails);
// app.get('/checking',userController.check);

// RestControllers
app.post('/users/signup',userController.createUser);
app.post('/users/signin',userController.validate);  
app.post('/users/:id/tasks',userController.createTask);
app.post('/users/:id/tasks/:tid',userController.update);
app.get('/users/:id/resttasks',userController.viewrestTasks);
module.exports = app;
// module.exports = rest;
// Add alert - User created please log in, forgot AJAX 401 
// basic auth
// logOut -> clean up the session storage