const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
//dynamic month drop down
const monthNum = new Date().getMonth();
const month = monthNames[monthNum];
let monthOptions = "<option value='' selected>Month</option>";
for (var m = 0; m < 12; m++) {
  monthOptions += "<option>" + monthNames[m] + "</option>";
}
document.getElementById("month").innerHTML = monthOptions;
//dynamic year drop down
const start = 1900;
const end = new Date().getFullYear();
let options = "<option value='' selected>Year</option>";
for (let year = start; year <= end; year++) {
  options += "<option>" + year + "</option>";
}
document.getElementById("year").innerHTML = options;

const logOut = document.querySelector(".logOutButton");

logOut.addEventListener("submit", e => {
  fetch("http://127.0.0.1:3000/logout", {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      return res.json();
    })
    .then(() => {
      window.location.href = "/login";
    });
});
