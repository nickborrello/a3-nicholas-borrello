window.onload = function () {
  // On load update the table

  updateContacts();

};

const updateContacts = async function () {

  // Clear the expenses
  let contactList = document.getElementById("contactList");
  contactList.innerHTML = '';

  // GET the current expenses
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