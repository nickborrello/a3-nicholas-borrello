const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require("mime"),
  dir = "public/",
  port = 3000;

var appdata = [];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  }
  if (request.url === "/update") {
    response.writeHead(200, "OK", { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  if (request.url === "/create") {
    let dataString = "";

    request.on("data", function (data) {
      dataString += data;
    });

    request.on("end", function () {
      // add the data to the app data
      dataString = calculateDaysRemaining(dataString);
      appdata.push(dataString);
      console.log("Added", appdata);
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end("New contact posted");
    });
  }
  // Delete the specified index from the appdata
  if (request.url === "/delete") {
    let dataIndex = 0;
    request.on("data", function (data) {
      dataIndex = data;
    })
    request.on("end", function() {
      console.log("removing index ", dataIndex);
      appdata.splice(dataIndex, 1);
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end("Expense removed");
    })
  }
};

const calculateDaysRemaining = (expense) => {
  let data = JSON.parse(expense);
  const currentDate = new Date();
  const dueDate = new Date(data["expenseDate"]);
  const daysRemaining = Math.ceil(
    (dueDate - currentDate) / (1000 * 60 * 60 * 24)
  );
  data["daysRemaining"] =
    daysRemaining >= 0 ? `${daysRemaining} day(s)` : "OVERDUE";
  return JSON.stringify(data);
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
