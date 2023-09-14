// FRONT-END (CLIENT) JAVASCRIPT HERE
const updateExpenses = async function () {
  
  // Clear the expenses
  let expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = '';
  
  // GET the current expenses
  const response = await fetch("/update", {
    method: "GET",
  });

  const expenses = await response.json();
  console.log(expenses);

  // Add the current expenses to the table
  for (let i = 0; i < expenses.length; i++) {
    addToTable(expenses[i]);
  }
};

const addToTable = function (expense) {
    let expenseList = document.querySelector("tbody");
    let data = JSON.parse(expense);
    var row = document.createElement("tr");

    // for loop for each key
    for (var cellKey in data) {
      const cell = document.createElement("td");
      cell.innerText = data[cellKey];
      if(cellKey !== "daysRemaining") {
        cell.setAttribute('contenteditable', true);
      }
      cell.addEventListener('input',function() {
        editTable();
      });
      row.appendChild(cell);
      }
    const cell = document.createElement("td");
    cell.innerHTML='<input type="button" value="Delete" onclick="deleteRow(this)"/>';
    row.appendChild(cell);
    expenseList.appendChild(row);
  
    // for each row in the table create a delete button
    }

const create = async function (event) {
  event.preventDefault();

  const name = document.querySelector("#expenseName"),
    number = document.querySelector("#expenseNumber"),
    dueDate = document.querySelector("#expenseDate"),
    json = {
      expenseName: name.value,
      expenseNumber: number.value,
      expenseDate: dueDate.value,
    },
    body = JSON.stringify(json);

  // POST new expense to server

  const response = await fetch("/create", {
    method: "POST",
    body,
  });

  const text = await response.text();
  console.log(text);

  // reset the create fields
  name.value = "";
  number.value = "";
  dueDate.valueAsDate = new Date();

  // show the newly update data for the client
  updateExpenses();
};

const deleteRow = async function (row) {
  // Delete the row from the table
  const i=row.parentNode.parentNode.rowIndex;
  const body = i-1;                                              
  document.getElementById('expenseList').deleteRow(i-1);
  
  // Delete the row from the server
  const reponse = await fetch("/delete", {   
    method: "POST",
    body,
  });
  
  console.log("Deleted row ", i-1);

  updateExpenses();
}

window.onload = function () {
  const name = document.querySelector("#expenseName"),
    number = document.querySelector("#expenseNumber"),
    photo = document.querySelector("#expenseDate");

  const button = document.querySelector("#createButton");
  button.onclick = create;

  document.querySelector("#expenseDate").valueAsDate = new Date();

  updateExpenses();
};
