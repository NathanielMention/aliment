const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const db = require('../config/database');
const model = require('../models/alimentModels');
const { body, check, validationResult } = require('express-validator');



router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/index.html'));
});


router.get('/signup', (req,res) => {
	res.sendFile(path.join(__dirname + '/../public/signup.html'));
});


router.post('/signup', [
		//server side signup validation
		check('username')
		.not()
		.isEmpty()
		.withMessage('Username is required')
		.isLength({ min: 3 })
		.withMessage('Username must be at least 3 characters')
		.trim()
		.isAlphanumeric()
		.withMessage('Username must have letters or numbers and no spaces')
		.custom((value, {req}) => {
			console.log(value);
			console.log(req.body.username);
			return model.findOne({ where: {username: req.body.username} })
			.then(model => {
				if (model) {
					return Promise.reject('Username already exists');
				}
			})
		}),
	
		check('password')
		.not()
		.isEmpty()
		.withMessage('Password is required')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters')
		.matches(/\d/)
		.withMessage('Password must have at least 1 number'),

		check('confirmPassword')
		.custom((value, { req }) => {
			if (value !== req.body.password) {
    			throw new Error('Password confirmation does not match password');
  			}
  			
  			// Indicates the success of this synchronous custom validator
  			return true;

  		})



	], (req, res) => {
	//object destructuring 
	const { username, password, calories, time } = req.body;

	//errors from sign up validation
	const errors = validationResult(req);
  	if (!errors.isEmpty()) {
    	return res.status(422).json({ errors: errors.array() });
  	}

	model.create({
		username,
		password,
		calories,
		time
	})
		.then(alimentUser => {
			res.json('welcome, ' + req.body.username)
			})
		.catch(err => console.log(err));
	})


router.get('/login', (req,res) => {
	res.sendFile(path.join(__dirname + '/../public/login.html'));
});


router.post('/login', [
		//server side login validation
		check('username')
		.not()
		.isEmpty()
		.withMessage('Username is required'),
	
		check('password')
		.not()
		.isEmpty()
		.withMessage('Password is required')

	],(req, res) => {

	const { username, password, calories, time } = req.body;
	//errors from login validation
	const loginErrors = validationResult(req);

		if (!loginErrors.isEmpty()) {
    	return res.status(422).json({ loginErrors: loginErrors.array() });
  	}
	
});


module.exports = router;

