var parserTools = require('./parser/parser');
var port = 3000;
// Fast html framework
const express = require('express');
const app = express();

// For receiving JSON in posts
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

// For the database
const sqlite3 = require('sqlite3'); //.verbose();
const db = new sqlite3.Database('./databases/database.db');

// Add restful controller
require('./ServerController')(app, db, jsonParser);

app.listen(port);
console.log("Port in use: " + port);
// Serve static files
app.use('/', express.static(__dirname + '/wwwroot'));

setInterval(function(){ parserTools.parseBudget(db)}, 5000);