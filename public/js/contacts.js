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

  console.log(contacts);

  // Clear the list
  const list = document.getElementById("contactList");
  list.innerHTML = "";

  // for each contact in contacts
  for(let i = 0; i < contacts.length; i++) {

    // create the div element and add it to the parent element
    let temp = document.getElementById("contact-card");
    let content = temp.content;
    content.getElementById("cardFirstName").innerHTML = contacts[i].firstName;
    content.getElementById("cardLastName").innerHTML = contacts[i].lastName;
    content.getElementById("tablePhone").innerHTML = contacts[i].phone;
    content.getElementById("tableEmail").innerHTML = contacts[i].email;
    content.getElementById("tableDateOfBirth").innerHTML = contacts[i].dateOfBirth;
    content.getElementById("tableStreetAddress").innerHTML = contacts[i].streetAddress + ", " + contacts[i].city + ", " + contacts[i].state + ", " + contacts[i].zipCode;
    content.getElementById("tableLastEdited").innerHTML = contacts[i].lastEdited + " day(s) ago";
    content.getElementById("deleteButton").onclick = function() {removeContact(contacts[i]._id)};
    let newChild = content.cloneNode(true);
    newChild.getElementById("deleteButton").onclick = function() {removeContact(contacts[i]._id)};
    newChild.getElementById("editButton").onclick = function() {editContact(contacts[i]._id)};
    document.getElementById("contactList").appendChild(newChild);
  }
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

async function removeContact(id) {
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

const daysUntilBirthday = function () {
  const today = new Date();
  const daysRemaining = Math.ceil(
      (this.birthday - today) / (1000 * 60 * 60 * 24)
  );
  return daysRemaining;
}

const initButtons = function () {
  const addButton = document.getElementById("createButton");
  addButton.onclick = showForm;

  const cancelButton = document.getElementById("cancelButton");
  cancelButton.onclick = hideForm;

  const submitButton = document.getElementById("submitButton");
  submitButton.onclick = addContact;

}
