const express      = require('express');
const path         = require('path');
const userModule   = require('./Login');
const session      = require("express-session");
const cookieParser = require('cookie-parser');
const cookie       = require('cookie');
const pug          = require('pug');

var onProduction = false;

function debugMe(str){
	if(!onProduction)
		console.log("" + str);	
}

var app = express();

app.set('view engine', 'pug');

app.use(require('body-parser').urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use(cookieParser());

app.use(session({resave: true, saveUninitialized: true, secret: 'SOMERANDOMSECRETHERE', cookie: { maxAge: 10000 }}));


app.use('/Login',userModule);

//app.get('/index',(req,res)=>)



var server = app.listen(8000 , ()=>{
                        
    console.log("Server prendido");
                        
});