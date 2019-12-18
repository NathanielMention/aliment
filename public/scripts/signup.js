const username = document.querySelector('.username');
const password = document.querySelector('.password');
const confirmPassword = document.querySelector('.confirmPassword');
const form = document.querySelector('.signupForm');
const errorElement = document.querySelector('.error');


form.addEventListener('submit', (e) => {

	e.preventDefault();

	//client side form validation
	const messages = [];

	if (username.value === '' || username.value == null) {
		messages.push('Username is required');
	}
	if (username.length < 3) {
		messages.push('Username must be at least 3 characters');
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
		errorElement.innerText = messages.join('\n');
	}


	const url = 'http://127.0.0.1:3000/signup';
	
	const data = {
		username: username.value,
		password: password.value,
		confirmPassword: confirmPassword.value
	};
	
	
	
	fetch(url, {
  		method: "POST",
  		headers: {
    		'Accept': 'application/json',
    		'Content-Type': 'application/json'
  		},
  		//make sure to serialize your JSON body
  		body: JSON.stringify(data)
	})
	.then((res) => res.json())
	.then(data => {
		if(data.errors){
			data.errors.forEach((err) => (
				errorElement.innerHTML += `<li>${err.msg}</li>`			
			))
		}
		else {
			window.location.href = '/';
		}
		
	})
	.catch(error => console.log(error))
});

