let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");

//show current date for home page
const alimentDate = new Date(Date.now()).toLocaleString().split(",")[0];
const calenderDate = document.querySelector(".calenderDate");
calenderDate.textContent = `${alimentDate}`;

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

function next() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}

function previous() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}

function jump() {
  currentYear = parseInt(selectYear.value);
  currentMonth = selectMonth.options[selectMonth.selectedIndex].value - 1;
  showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {
  let firstDay = new Date(year, month).getDay();
  let daysInMonth = 32 - new Date(year, month, 32).getDate();

  // body of the calendar
  let tbl = document.getElementById("calendar-body");

  // clearing all previous cells
  tbl.innerHTML = "";

  // filing data about month and in the page via DOM.
  monthAndYear.innerHTML = months[month] + " " + year;

  // creating all cells
  let date = 1;
  for (let i = 0; i < 6; i++) {
    // creates a table row
    let row = document.createElement("tr");

    //creating individual cells, filing them up with data.
    for (let j = 0; j < 7; j++) {
      if (date > daysInMonth) {
        break;
      }
      const cell = document.createElement("td");
      cell.addEventListener("click", e => {
        calenderDate.textContent = `${currentMonth + 1}/${
          cellText.textContent
        }/${currentYear}`;
      });
      let cellText = document.createTextNode(date);
      //empty cells before first day
      if (i === 0 && j < firstDay) {
        cellText = document.createTextNode("");
      } else {
        if (
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          // highlight today's date
          cell.classList.add("todaysDate");
        }
        date++;
      }
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
    // appending each row into calendar body.
    tbl.appendChild(row);
  }
}

//dynamic month drop down
let monthNum = new Date().getMonth();
let month = months[monthNum];
let monthOptions = `<option value=${monthNum} >Month</option>`;
for (var m = 1; m <= 12; m++) {
  monthOptions += `<option value=${m}>${months[m - 1]}</option>`;
}
document.getElementById("month").innerHTML = monthOptions;
//dynamic year drop down
let start = 1900;
let end = new Date().getFullYear();
let options = `<option value=${end} >Year</option>`;
for (let year = start; year <= end; year++) {
  options += `<option value=${year}>${year}</option>`;
}
document.getElementById("year").innerHTML = options;

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

prevBtn.addEventListener("click", previous);
nextBtn.addEventListener("click", next);
