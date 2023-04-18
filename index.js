//var declarations

var jsonData = [];
var globalFlag = true;
var localCounter = 10;
var stepSize = 10;
var rows = 0;

const countElement = document.getElementById('count');

// mobile navbar hide and display

var menu = document.getElementById("navOptions");

function menuSlide() {
    menu.style.display = "block"
}

function closeSlide() {
    menu.style.display = "none"
}

//fetching data from .json
fetch("dataBase.json")
  .then((res) => res.json())
  .then((json) => {
    jsonData = json;
    renderTable(jsonData.slice(0, stepSize)); // rendering the first 10 rows

    // Getting all possible unique values for each select
    jsonData.forEach((book) => {
      uniqueValues.title.add(book.title);
      uniqueValues.author.add(book.author);
      uniqueValues.subject.add(book.subject);
      uniqueValues.publication_date.add(book.publication_date);
    });

    // Populating the dropdown menus with unique values
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

//rendering intial table
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

// Adding an event listener to the search button
document.getElementById("search-btn").addEventListener("click", () => {
  let searchInput = document.getElementById("search-input").value;
  console.log(searchInput)

  // code to avoid last space
  if(searchInput.endsWith(" ")) {
    searchInput = searchInput.slice(0, -1);
  }

  let filteredData = jsonData.filter((data) => {
    return Object.values(data).some((value) =>
    typeof value === 'string' && value.toLowerCase().includes(searchInput.toLowerCase())
    );
  });
  renderTable1(filteredData);
});

// to handle keyup event in search bar and mimic search button
document.getElementById("search-input").addEventListener("keyup", (event) => {
  event.preventDefault();
  document.getElementById("search-btn").click();
});


// to render filtered entries
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

//load on scroll (10 rows)
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

//filtering based on selected atrributed

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
  
  renderTable1(filteredData);
}

//making cards functional

function filterData1(subject) {
  let filteredData = jsonData.filter(data => {
    return data.subject === subject;
  });
  
  renderTable1(filteredData);
}

const uniqueValues = {
  title: new Set(),
  author: new Set(),
  subject: new Set(),
  publication_date: new Set(),
};

// catching click from clear button
document.getElementById("clear-btn").addEventListener("click", clearFilters);

function clearFilters() {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  
  const titleDropdown = document.getElementById("title");
  const authorDropdown = document.getElementById("author");
  const subjectDropdown = document.getElementById("subject");
  const publishDateDropdown = document.getElementById("publish-date");

  // Resetting the values of the dropdown menus to their default values
  titleDropdown.selectedIndex = 0;
  authorDropdown.selectedIndex = 0;
  subjectDropdown.selectedIndex = 0;
  publishDateDropdown.selectedIndex = 0;

  countElement.textContent = `Displaying 100/${jsonData.length} books`;
  document.getElementById("search-input").value = '';

  // Trigger the filterData function to update the table with all data
  renderTable(jsonData.slice(0, localCounter));
}


//to validate the form and to make it a bit more secure
  $(document).ready(function() {
    $('#enquiryForm').validate({
      rules: {
        name: 'required',
        email: {
          required: true,
          email: true
        },
        message: 'required'
      },
      messages: {
        name: 'Please enter your name',
        email: {
          required: 'Please enter your email',
          email: 'Please enter a valid email address'
        },
        message: 'Please enter your message'
      },
      submitHandler: function(form) {
        form.submit();
      }
    });
  });
