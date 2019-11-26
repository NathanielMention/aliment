const username = document.querySelector('.username');
const password = document.querySelector('.password');
const form = document.querySelector('.signupForm');
const errorElement = document.querySelector('.error');

//client side form validation
form.addEventListener('submit', (e) => {
	const messages = [];
	if (username.value === '' || name.value == null) {
		messages.push('Username is required');
	}

	if (password.value === '' || password.value == null) {
		messages.push('Password is required');
	}	

	if (messages.length > 0) {
	e.preventDefault();
	errorElement.innerText = messages.join(',');
	}
})