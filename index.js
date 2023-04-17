var jsonData = [];
var globalFlag = true;
var localCounter = 10;
var stepSize = 10;
var rows = 0;

const countElement = document.getElementById('count');

var menu = document.getElementById("navOptions");

function menuSlide() {
    menu.style.display = "block"
}

function closeSlide() {
    menu.style.display = "none"
}

//fetching data from backend
fetch("dataBase.json")
  .then((res) => res.json())
  .then((json) => {
    jsonData = json;
    renderTable(jsonData.slice(0, stepSize)); // render the first set of rows

    // Get unique values for each dropdown menu
    jsonData.forEach((book) => {
      uniqueValues.title.add(book.title);
      uniqueValues.author.add(book.author);
      uniqueValues.subject.add(book.subject);
      uniqueValues.publication_date.add(book.publication_date);
    });

    // Populate the dropdown menus with unique values
    const titleDropdown = document.getElementById("title");
    const authorDropdown = document.getElementById("author");
    const subjectDropdown = document.getElementById("subject");
    const publication_dateDropdown = document.getElementById("publish-date");

    Object.keys(uniqueValues).forEach((key) => {
      uniqueValues[key].forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.text = value;
        eval(`${key}Dropdown`).appendChild(option);
      });
    });
  });

  function renderTable(rows) {
    const tableBody = document.getElementById('tableBody');
    for (let i = 0; i < rows.length; i++) {
      const row = document.createElement('tr');
      const item = rows[i];
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.title}</td>
        <td>${item.author}</td>
        <td>${item.subject}</td>
        <td>${item.publication_date}</td>
      `;
  
      tableBody.appendChild(row);
    }
  }

// Define a variable to store the original data
let originalData = [];

// Add an event listener to the search button
document.getElementById("search-btn").addEventListener("click", () => {
  const searchInput = document.getElementById("search-input").value;
  let filteredData = jsonData.filter((data) => {
    return Object.values(data).some((value) =>
    typeof value === 'string' && value.toLowerCase().includes(searchInput.toLowerCase())
    );
  });
  renderTable1(filteredData);
});

// Add an event listener to the search input field to handle Enter key press
document.getElementById("search-input").addEventListener("keyup", (event) => {
  event.preventDefault();
  document.getElementById("search-btn").click();
});


function renderTable1(data) {
  const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
  for (let i = 0; i < data.length; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data[i].id}</td>
        <td>${data[i].title}</td>
        <td>${data[i].author}</td>
        <td>${data[i].subject}</td>
        <td>${data[i].publication_date}</td>
      `;
  
      tableBody.appendChild(row);
  }
    countElement.textContent = `Displaying ${data.length}/${jsonData.length} books`;
  }

var table = document.getElementById('table');

table.addEventListener('scroll', () => {
  if (globalFlag == true && table.scrollTop + table.clientHeight >= table.scrollHeight - 1) {
    // fetch more data and render the table
    const start = localCounter;
    const stop = localCounter + stepSize;
    if (stop >= jsonData.length) {
      globalFlag = false;
    }
    const rowsToRender = jsonData.slice(start, stop);
    renderTable(rowsToRender);
    localCounter = stop;
  }
});

// trial code for filtering

document.getElementById('title').addEventListener('change', filterData);
document.getElementById('author').addEventListener('change', filterData);
document.getElementById('subject').addEventListener('change', filterData);
document.getElementById('publish-date').addEventListener('change', filterData);

function filterData() {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const subject = document.getElementById('subject').value;
  const publishDate = document.getElementById('publish-date').value;

  console.log(title)
  console.log(author)
  console.log(subject)
  console.log(publishDate)
  
  let filteredData = jsonData.filter(data => {
    return (!title || data.title === title) &&
           (!author || data.author === author) &&
           (!subject || data.subject === subject) &&
           (!publishDate || data.publication_date === publishDate);
  });

  // console.log(filteredData)
  
  renderTable1(filteredData);
}

//making cards functionala

// document.getElementById('Education').addEventListener('click', filterData1('Education'));
// document.getElementById('History').addEventListener('click', filterData1('History'));
// document.getElementById('Fiction').addEventListener('click', filterData1('Fiction'));
// document.getElementById('Biography').addEventListener('click', filterData1('Biography'));
// document.getElementById('Economics').addEventListener('click', filterData1('Economics'));
// document.getElementById('Law').addEventListener('click', filterData1('Law'));
// document.getElementById('Novel').addEventListener('click', filterData1('Novel'));
// document.getElementById('Photography').addEventListener('click', filterData1('Photography'));

function filterData1(subject) {
  console.log('works')
  let filteredData = jsonData.filter(data => {
    return data.subject === subject;
  });
  
  renderTable1(filteredData);
}

// const card = document.querySelectorAll('.category');

// console.log(card)

// card.addEventListener('click', function() {
//   const cardText = this.querySelector('.cardTxt').textContent;
//   console.log(cardText);
//   // Do something with the card text
// });


const uniqueValues = {
  title: new Set(),
  author: new Set(),
  subject: new Set(),
  publication_date: new Set(),
};

// Add this event listener to your JavaScript code
document.getElementById("clear-btn").addEventListener("click", clearFilters);

function clearFilters() {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  // Get references to the dropdown menus
  const titleDropdown = document.getElementById("title");
  const authorDropdown = document.getElementById("author");
  const subjectDropdown = document.getElementById("subject");
  const publishDateDropdown = document.getElementById("publish-date");

  // Reset the selected values of the dropdown menus to their default values
  titleDropdown.selectedIndex = 0;
  authorDropdown.selectedIndex = 0;
  subjectDropdown.selectedIndex = 0;
  publishDateDropdown.selectedIndex = 0;

  countElement.textContent = `Displaying 60/${jsonData.length} books`;
  document.getElementById("search-input").value = '';

  // Trigger the filterData function to update the table with unfiltered all data
  renderTable(jsonData.slice(0, localCounter));
}
