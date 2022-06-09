const Router = require("express");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var sql = require("mssql");

// app.use(express.bodyParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// config for your database
var config = {
  user: "MyLogin",
  password: "souvik",
  server: "localhost",
  database: "application_test",
  options: {
    trustedconnection: true,
    trustServerCertificate: true,
  },
};

// == Read function
app.get("/getItems", function (req, res) {
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query("exec spReadItems", function (err, result) {
      if (err) console.log(err);

      // send records as a response
      res.send(result.recordset);
    });
  });
});

// == add  function
app.post("/additem", function (req, res) {
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
    request.input("Id", sql.Int, req.body.Id);
    request.input("Title", sql.VarChar, req.body.Title);

    request.execute("spInsertItem", (err, result) => {
      if (!err) console.log(result);
      else console.log(err);
    });
  });
  console.log(req.body);
  res.send("New Item added");
});

// == update function
app.put("/edititem/:id", function (req, res) {
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
    request.input("Id", sql.Int, req.body.Id);
    request.input("Title", sql.VarChar, req.body.Title);

    request.execute("spUpdateItem", (err, result) => {
      if (!err) console.log(result);
      else console.log(err);
    });
  });
  console.log(req.body);
  res.send("Item Updated successfully");
});

// == delete function
app.delete("/deleteitem/:id", function (req, res) {
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
    request.input("Id", sql.Int, req.params.id);

    // query to the database and get the records
    request.execute("spDeleteItem", (err, result) => {
      if (!err) console.log(result);
      else console.log(err);
    });
  });
  console.log(req.body);
  res.send("Item Deleted successfully");
});

app.listen(5000, function () {
  console.log("Server is running..");
});
