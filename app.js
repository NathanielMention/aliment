const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();

//database
const db = require('./config/database');

//test DB
db.authenticate()
.then(() => console.log('Database connected..'))
.catch(err => console.log('Error:' + err))

const app = express();

//static pages
app.use(express.static('./public'))

//aliment routes
const aliment = require('./routes/alimentRoutes')

app.use('/', aliment)
app.use('/signup', aliment)
app.use('/login', aliment)

//listen to port
app.listen(3000);
console.log('You are listening to port 3000');
