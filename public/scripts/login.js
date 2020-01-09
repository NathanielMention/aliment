const username = document.querySelector('.username');
const password = document.querySelector('.password');
const form = document.querySelector('.loginForm');
const errorElement = document.querySelector('.error');


form.addEventListener('submit', (e) => {
	
	e.preventDefault();

	//client side form validation
	const messages = [];

	if (username.value === '' || username.value == null) {
		messages.push('Username is required');
	}

	if (password.value === '' || password.value == null) {
		messages.push('Password is required');
	}	

	if (messages.length > 0) {
	errorElement.innerText = messages.join('\n');
	}

	
	const url = 'http://127.0.0.1:3000/login';
	
	const data = {
		username: username.value,
		password: password.value
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
		if(data.loginErrors && data.loginErrors.length > 0){
			data.loginErrors.forEach((err) => (
				errorElement.innerHTML += `<li>${err.msg}</li>`			
			))
		}
		else {
			console.log('TEST!!!!!!!!!!')
			window.location.href = '/';
		}
	})
	.catch(error => console.log(error))
});

