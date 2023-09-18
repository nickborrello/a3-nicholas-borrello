window.onload = function () {
  // On load update the table
  updateContacts();
  initButtons();
  hideForm();

};
const updateContacts = async function () {

  // GET the current contacts
  const response = await fetch("/update", {
    method: "GET",
  });

  const contacts = await response.json();
  console.log(contacts);
};

const addContact = async function () {
  // Get the data from the form
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  // POST the data to the server
  const response = await fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, phone, email }),
  });

  // Update the table
  updateContacts();
}

const removeContact = async function (id) {
  // POST the data to the server
  const response = await fetch("/remove", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id: id }),
  });

  // Update the table
  updateContacts();
}

const hideForm = function () {
  // Show the create contact button
  const button = document.getElementById("createButton");
  button.classList.remove("hidden");
  // Hide the form
  const form = document.getElementById("contactForm");
  form.classList.add("hidden");
}

const showForm = function () {
  // Hide the create contact button
  const button = document.getElementById("createButton");
  button.classList.add("hidden");
  // Show the form
  const form = document.getElementById("contactForm");
  form.classList.remove("hidden");
}

const initButtons = function () {
  const addButton = document.getElementById("createButton");
  addButton.onclick = showForm;

  const cancelButton = document.getElementById("cancelButton");
  cancelButton.onclick = hideForm;

  const submitButton = document.getElementById("submitButton");
  submitButton.onclick = addContact;
}