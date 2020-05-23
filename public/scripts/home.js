const createnode = (element) => document.createElement(element);
const append = (parent, el) => parent.appendChild(el);
const remove = (parent, el) => parent.removeChild(el);
const toggleButton = document.getElementsByClassName("toggle-button")[0];
const navLinks = document.getElementsByClassName("navLinks")[0];

toggleButton.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

//use event delgation to make foodlist clickable
document.querySelector(".foodList").addEventListener("click", (e) => {
  const userUl = document.querySelector(".userList");
  const target = e.target;
  if (target.matches("li")) {
    const userLi = createnode("li");
    userLi.textContent = target.textContent;
    append(userUl, userLi);

    incrementCalories(target);

    //make userUL clickable and <li> removable
    userLi.addEventListener("click", (e) => {
      if (target.matches("li")) {
        remove(userUl, userLi);
        decrementCalories(target);
      }

      updateCalorieCount(target);
    });
  }
});

//show current date for home page
const alimentDate = new Date(Date.now()).toLocaleString().split(",")[0];
const calenderDate = document.querySelector(".calenderDate");
calenderDate.textContent = `${alimentDate}`;

//check if food request is submitted
let isGettingFood = false;
let calorieAmount = 0;

const updateCalorieCount = () => {
  let totalCalories = document.querySelector(".totalCalories");
  totalCalories.textContent = `Calories: ${Math.floor(calorieAmount)}`;
};

const incrementCalories = (target) => {
  calorieAmount += Number(target.dataset.calories);
  updateCalorieCount();
};

const decrementCalories = (target) => {
  calorieAmount -= Number(target.dataset.calories);
  updateCalorieCount();
};

const submitFood = (e) => {
  e.preventDefault();
  if (isGettingFood) {
    return;
  }
  isGettingFood = true;

  const foodInputValue = document.querySelector(".searchFood").value;
  const ul = document.querySelector(".foodList");

  //clear foodlist
  if (ul.children.length > 0) {
    while (ul.children.length > 0) {
      remove(ul, ul.firstChild);
    }
  }

  // takes user input value/food value and returns fetched data in ul
  getFood(foodInputValue)
    .then((response) => response.json())
    .then((data) => {
      const foodList = data.hits;
      isGettingFood = false;

      //go through foodlist array one by one to create list of food
      foodList.forEach((food) => {
        const li = createnode("li");
        const itemName = food.fields.item_name;
        const calories = food.fields.nf_calories;
        const servingSize = food.fields.nf_serving_size_qty;
        const units = food.fields.nf_serving_size_unit;

        //use dataset property to store calories value in each <li>
        li.dataset.calories = calories;
        li.textContent = `${itemName} ${calories} calories ${servingSize} ${units}`;
        append(ul, li);
      });
    })
    .catch((error) => console.log(error));
};

const getFood = (foodValue) => {
  //break down url of api into consts
  const api = "https://api.nutritionix.com/v1_1/search/";
  const alimentId = "&appId=67e4c01d";
  const alimentKey = "&appKey=35d36f51e95d5950f113f861be86c0ba";
  const fields = "&fields=item_name,brand_name,item_id,nf_calories";

  //template literals to return fetch call of url/api as a parameter
  return fetch(`${api}${foodValue}?${fields}${alimentId}${alimentKey}`);
};

// allow user to submit input value
const form = document.querySelector(".searchForm");

form.addEventListener("submit", submitFood);

const input = document.querySelector(".searchFood");

//allow user to submit food with enter key
input.addEventListener("keyup", (e) => {
  const key = e.key || e.keyCode;
  if (key === "Enter" || key === "enter" || key === 13) {
    submitFood(e);
  }
});

const logOut = document.querySelector(".logOutButton");

logOut.addEventListener("submit", (e) => {
  fetch("/logout", {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then(() => {
      window.location = "/login";
    });
});

const saveBtn = document.querySelector(".saveBtn");

saveBtn.addEventListener("click", (e) => {
  const userUl = document.querySelector(".userList");
  const data = {
    date: calenderDate.textContent,
    calories: calorieAmount,
    food: userUl.textContent.replace(/[\n\r]+|[\s]{2,}/g, " ").trim(),
  };

  fetch(`/home`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    //make sure to serialize your JSON body
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
});

//indicates successful save by button color change
saveBtn.addEventListener("click", clickDelay);

function clickDelay(e) {
  e.target.classList.add("special");
  setTimeout(function () {
    e.target.classList.remove("special");
  }, 2000);
}

//fetch saved db data for specific date clicked
const td = document.getElementsByTagName("td");
for (var i = 0; i < td.length; i++) {
  td[i].addEventListener("click", (e) => {
    fetch(`/intake/?date=${calenderDate.textContent}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const userFood = document.querySelector(".dataList");
        if (data.calories === undefined || null) {
          if (userFood.children.length > 0) {
            while (userFood.children.length > 0) {
              remove(userFood, userFood.firstChild);
            }
          }
          return;
        } else {
          //clear list if new date clicked
          if (userFood.children.length > 0) {
            while (userFood.children.length > 0) {
              remove(userFood, userFood.firstChild);
            }
          }
          const userCalories = document.querySelector(".totalCalories");
          const li = createnode("li");
          const food = data.food;
          //add food data to list
          calorieAmount = data.calories;
          const calories = data.calories;
          li.dataset.data = calories;
          li.textContent = `${food}`;
          append(userFood, li);
          userCalories.textContent = `Calories: ${Math.floor(calorieAmount)}`;
        }
      });
  });
}
//fetch saved userlist data from db for current date if available
fetch(`/intake/?date=${calenderDate.textContent}`, {
  method: "GET",
  credentials: "include",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    if (data.calories === undefined || null) {
      return;
    } else {
      const userFood = document.querySelector(".dataList");
      //clear list if new date clicked
      if (userFood.children.length > 0) {
        while (userFood.children.length > 0) {
          remove(userFood, userFood.firstChild);
        }
      }
      const userCalories = document.querySelector(".totalCalories");
      const li = createnode("li");
      const food = data.food;
      //add food data to list
      calorieAmount = data.calories;
      const calories = data.calories;
      li.dataset.data = calories;
      li.textContent = `${food}`;
      append(userFood, li);
      userCalories.textContent = `Calories: ${Math.floor(calorieAmount)}`;
    }
  });

const dataList = document.querySelector(".dataList");
//remove data from list
dataList.addEventListener("click", (e) => {
  const userCalories = document.querySelector(".totalCalories");
  const target = e.target;
  if (target.matches("li")) {
    const li = dataList.firstChild;
    li.remove();
    calorieAmount -= target.getAttribute("data-data");
    userCalories.textContent = `Calories: ${Math.floor(calorieAmount)}`;
  }
});
