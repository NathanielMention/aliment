const username = document.querySelector('.username');
const password = document.querySelector('.password');
const confirmPassword = document.querySelector('.confirmPassword');
const form = document.querySelector('.signupForm');
const errorElement = document.querySelector('.error');

//client side form validation
form.addEventListener('submit', (e) => {
	const messages = [];

	if (username.value === '' || username.value == null) {
		messages.push('Username is required');
	}

	if (password.value === '' || password.value == null) {
		messages.push('Password is required');
	}	

	if (password.length < 6) {
		messages.push('Password must be at least 6 characters');
	}	

	if (confirmPassword.value === '' || confirmPassword.value == null) {
		messages.push('Please confirm password');
	}

	if (password.value !== confirmPassword.value) {
		messages.push('Incorrect password, Please re-confirm');
	}	

	if (messages.length > 0) {
		e.preventDefault();
		errorElement.innerText = messages.join('\n');
	}
})

const url = 'http://127.0.0.1:3000/signup';
const data = {
	username,
	password,
	confirmPassword
};

fetch(url, {
  method: "post",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  //make sure to serialize your JSON body
  body: JSON.stringify(data)
})
.then( (res) => res.json())
.then(data => {
	console.log(data)
})
.catch(err => console.log(err))

