const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
// const setCurrentUser = require('./middleware/setCurrentUser.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Parsing middleware
app.use(bodyParser.urlencoded({extended:false}));

// Parse application/JSON
app.use(bodyParser.json());
// const logger = require('./server/log/logger');
// app.use(logger);

// static files
app.use(express.static('public'));
console.log(path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));

console.log(path.join(__dirname, "images"));
// Template Engine
app.engine('hbs',exphbs.engine({extname:'.hbs'}));
app.set('view engine','hbs');

// Connection Port
// const pool  = mysql.createPool({
//     connectionLimit : 1  0,
//     host            : 'localhost',
//     user            : 'root',
//     password        : '',
//     database        : 'tasks'
// })

const routes = require('./server/routes/user');
app.use('/', routes);
const rest = require('./server/rest/user');
app.use('/',rest);
// app.get('',(req,res)=>{
//     res.render('home')
// })
// function logger(req,res,next){
//     console.log('log ' + req.cookies);
//     next();
// }




app.listen(port,()=>console.log(`Listening on port ${port}`));

