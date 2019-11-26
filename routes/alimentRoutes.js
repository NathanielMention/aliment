const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const db = require('../config/database');
const model = require('../models/alimentModels');

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/index.html'));
});

router.get('/signup', (req,res) => {
	res.sendFile(path.join(__dirname + '/../public/signup.html'));
});

router.post('/signup', urlencodedParser, (req, res) => {
	//object destructuring 
	const { username, password, calories, time } = req.body;

	//server side login/signup validation
	const errors = [];

	if(!username) {
		errors.push({ text: 'Please enter username'});
	}
	if(!password) {
		errors.push({ text: 'Please enter password'});
	}

	//check for errors
	if(errors.length > 0) {
		res.sendFile(path.join(__dirname + '/../public/signup.html'));
		res.send(			
			errors, 
			username, 
			password, 
			calories, 
			time);
		console.log(errors);
	} else {
	//insert into table
	model.create({
		username,
		password,
		calories,
		time
	})
		.then(alimentUser => res.send('welcome, ' + req.body.username))
		.catch(err => console.log(err));
	}
});

router.get('/login', (req,res) => {
	res.sendFile(path.join(__dirname + '/../public/login.html'));
});

router.post('/login', urlencodedParser, (req, res) => {
	console.log(req.body);
	res.send('welcome, ' + req.body.username)
});

model.findAll().then(alimentUser => {
  console.log(alimentUser);
})
.catch(err => console.log(err));

module.exports = router;

