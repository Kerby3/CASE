let express = require('express');
const bodyParser = require('body-parser');
let app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
let http = require('http');
let fs = require('fs');
const mysql = require("mysql2");

const PORT = 3306;

let artists = [
{
	id: 1,
	name: 'Green Day'
},
{
	id: 2,
	name: '30 seconds to Mars'
},
{
	id: 3,
	name: 'TOP'
}
];

app.get('/', function (req, res) {
	fs.readFile('./index.html', function (err, html) {
		res.setHeader("Content-Type", "text/html");
		res.write(html);
  		res.end();
	});
})

app.post('/register', urlencodedParser, function (req, res) {
	fs.readFile('./registrationForm.html', function (err, html) {
		res.setHeader("Content-Type", "text/html");
		res.write(html);
		res.end();
	});
})

app.post('/', urlencodedParser, function (req, res) {
	fs.readFile('./index.html', function (err, html) {
		res.setHeader("Content-Type", "text/html");
		res.write(html);
		res.end();
		let client = [req.body.name, req.body.surname]
		const connection = mysql.createConnection({
		  host: "localhost",
		  user: "root",
		  database: "clients",
		  password: "qwerty",
		  port: 3307
		});
		// тестирование подключения
		  connection.connect(function(err){
		    if (err) {
		      return console.error("Ошибка: " + err.message);
		    }
		    else{
		      console.log("Подключение к серверу MySQL успешно установлено");
		    }
		 });
		  connection.execute("INSERT INTO clients (FIRST_NAME, SURNAME) VALUE (?,?)",client, function (err, results) {
		  	if (err) {
		  		console.log(err);
		  	} else {
		  		console.log('Клиент добавлен!');
		  	}
		  });
		 // закрытие подключения
		 connection.end(function(err) {
		  if (err) {
		    return console.log("Ошибка: " + err.message);
		  }
		  console.log("Подключение закрыто");
		});
	});
})

app.get('/artists', function (req, res) {
	res.send(artists);
})

app.get('/artists/:id', function (req, res) {
	console.log(req.params);
	let artist = artists.find(function (artist) {
		return artist.id === Number(req.params.id);
	});
	res.send(artist);
})

app.listen(PORT, function () {
	console.log('API app started');
})