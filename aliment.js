const submitFood = () => {

	const foodInputValue = document.querySelector('.searchFood').value
	// takes user input value/food value and returns fetched data
	getFood(foodInputValue)
	.then(response => response.json())
	.then(data => console.log(data))
	.catch(error => console.log(error))
}

const getFood = (foodValue) => {
	//break down url of api into consts
	const api = 'https://api.nutritionix.com/v1_1/search/';
	const alimentId = '&appId=67e4c01d';
	const alimentKey = '&appKey=35d36f51e95d5950f113f861be86c0ba';
	const fields = '&fields=item_name,brand_name,item_id,nf_calories';
	//template literals to return fetch call of url/api as a parameter
	return fetch(`${api}${foodValue}?${fields}${alimentId}${alimentKey}`)
}

// create button so user can submit input value
const button = document.getElementById('submit');

button.addEventListener('click', submitFood);

