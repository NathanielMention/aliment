//creates type of node element you pass in the parameters
const createnode = (element) => document.createElement(element);
//appends second parameter(el) to the first(parent)
const append = (parent, el) => parent.appendChild(el); 


const submitFood = () => {

	const foodInputValue = document.querySelector('.searchFood').value

	// takes user input value/food value and returns fetched data
	getFood(foodInputValue)
	.then(response => response.json())
	.then((data) => {
		const foodList = data.hits; //get results
		const ul = document.querySelector('.foodList');
		foodList.forEach((food) => { //
			const li = createnode ('li'); 
			console.log(food.fields);
			li.textContent = food.fields.item_name + food.fields.nf_calories + food.fields.nf_serving_size_qty + food.fields.nf_serving_size_unit;
			append(ul,li);
		})
	})
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
;


