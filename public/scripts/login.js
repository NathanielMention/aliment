const username = document.querySelector(".username");
const password = document.querySelector(".password");
const form = document.querySelector(".loginForm");
const errorElement = document.querySelector(".error");
const toggleButton = document.getElementsByClassName("toggle-button")[0];
const navLinks = document.getElementsByClassName("navLinks")[0];

toggleButton.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  //client side form validation
  const messages = [];

  if (username.value === "" || username.value == null) {
    messages.push("Username is required");
  }

  if (password.value === "" || password.value == null) {
    messages.push("Password is required");
  }

  if (messages.length > 0) {
    errorElement.innerText = messages.join("\n");
  }

  const url = "/login";

  const data = {
    username: username.value,
    password: password.value,
  };

  fetch(url, {
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
      if (res.status === 401) {
        return { loginErrors: [{ msg: "Username or Password is incorrect" }] };
      } else {
        return res.json();
      }
    })
    .then((data) => {
      if (data.loginErrors && data.loginErrors.length > 0) {
        data.loginErrors.forEach(
          (err) => (errorElement.innerHTML += `<li>${err.msg}</li>`)
        );
      } else {
        window.location.href = "/home";
      }
    })
    .catch((error) => console.log(error));
});
