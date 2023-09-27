window.onload = function () {
    // On load update the table
    initButtons();
  
  };

const login = async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  
  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
}

const initButtons = function () {
    const loginButton = document.getElementById("loginButton");
    loginButton.onclick = login;
}