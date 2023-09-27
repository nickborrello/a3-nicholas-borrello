window.onload = function () {
    // On load update the table
    initButtons();
  
  };

const register = async function () {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  console.log(username);
  console.log(password);

  const response = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
}

const initButtons = function () {
    const registerButton = document.getElementById("registerButton");
    registerButton.onclick = register;
}