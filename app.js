const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();
const app = express();
const aliment = require('./routes/alimentRoutes')
const db = require('./config/database');


app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//test DB
db.authenticate()
.then(() => console.log('Database connected..'))
.catch(err => console.log('Error:' + err))


app.use('/', aliment)

//listen to port
app.listen(3000);
console.log('You are listening to port 3000');
