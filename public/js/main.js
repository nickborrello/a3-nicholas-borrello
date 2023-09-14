// FRONT-END (CLIENT) JAVASCRIPT HERE
window.onload = function () {
  const name = document.querySelector("#expenseName"),
    number = document.querySelector("#expenseNumber"),
    photo = document.querySelector("#expenseDate");

  const button = document.querySelector("#createButton");
  button.onclick = create;

  document.querySelector("#expenseDate").valueAsDate = new Date();

  updateExpenses();
};
