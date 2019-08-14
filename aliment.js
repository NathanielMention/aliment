//creates type of node element you pass in the parameters
const createnode = (element) => document.createElement(element);
//appends second parameter(el) to the first(parent)
const append = (parent, el) => parent.appendChild(el); 


const submitFood = () => {

	const foodInputValue = document.querySelector('.searchFood').value

	// takes user input value/food value and returns fetched data in ul
	getFood(foodInputValue)
	.then(response => response.json())
	.then((data) => {
		const foodList = data.hits; 
		const ul = document.querySelector('.foodList');
		//go through foodlist array one by one to create list of food
		foodList.forEach((food) => { //
			const li = createnode ('li'); 
			const itemName = food.fields.item_name;
			const calories = food.fields.nf_calories;
			const servingSize = food.fields.nf_serving_size_qty;
			const units = food.fields.nf_serving_size_unit;
			li.textContent = `${itemName} ${calories} calories ${servingSize} ${units}`;
			append(ul,li);

		})

		//use event delgation to make foodlist clickable
		ul.addEventListener('click', (e) => {
				const userUl = document.querySelector('.userList');
				const target = e.target;
				if (target.matches('li')) {
					const userLi = createnode('li');
					userLi.textContent = target.textContent;
					append(userUl,userLi);
				}	
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



