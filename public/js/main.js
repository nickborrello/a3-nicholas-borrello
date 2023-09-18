window.onload = function () {
  // On load update the table
  updateContacts();
  initButtons();
  hideForm();

};
const updateContacts = async function () {

  // GET the current contacts
  const response = await fetch("/docs", {
    method: "GET",
  });

  const contacts = await response.json();

  // for each contact in contacts
  for(let i = 0; i < contacts.length; i++) {
    // create a new contact object
    const contact = contacts[i];

    // create the div element and add it to the parent element
    const div = document.createElement("div");
    document.getElementById("contactList").appendChild(div);

    // add the contact information to the div
    div.innerHTML = 
    '<p>' + contact.firstName + ' ' + contact.lastName + '</p>' +
    '<p>' + contact.phone + '</p>' +
    '<p>' + contact.email + '</p>' +
    '<p>' + contact.dateOfBirth + '</p>' +
    '<p>' + contact.streetAddress + '</p>' +
    '<p>' + contact.city + ', ' + contact.state + ' ' + contact.zipCode + '</p>' +
    '<button type="button" class="btn btn-danger" onclick="removeContact(\'' + contact._id + '\')">Remove</button>';
  }
  console.log(JSON.stringify(contacts));
};

const addContact = async function () {
  // Get the data from the form
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const dateOfBirth = document.getElementById("dateOfBirth").value;
  const streetAddress = document.getElementById("streetAddress").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const zipCode = document.getElementById("zipCode").value;

  // POST the data to the server
  const response = await fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, phone, email, dateOfBirth, streetAddress, city, state, zipCode }),
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
  // unblur the contact list
  const list = document.getElementById("contactList");
  list.classList.remove("blur-page");
}

const showForm = function () {
  // Hide the create contact button
  const button = document.getElementById("createButton");
  button.classList.add("hidden");
  // Show the form
  const form = document.getElementById("contactForm");
  form.classList.remove("hidden");
  // blur the contact list
  const list = document.getElementById("contactList");
  list.classList.add("blur-page");
}

const initButtons = function () {
  const addButton = document.getElementById("createButton");
  addButton.onclick = showForm;

  const cancelButton = document.getElementById("cancelButton");
  cancelButton.onclick = hideForm;

  const submitButton = document.getElementById("submitButton");
  submitButton.onclick = addContact;
}