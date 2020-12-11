let express = require('express');//подключение компонентов
const bodyParser = require('body-parser');//подключение компонентов
let app = express();//подключение компонентов
const urlencodedParser = bodyParser.urlencoded({extended: false});//подключение компонентов
let http = require('http');//подключение компонентов
let fs = require('fs');//подключение компонентов
const mysql = require("mysql2");//подключение компонентов

const PORT = 3306;// выбор порта для сервера

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

app.get('/', function (req, res) { // если зашел на главную страницу по ссылке
	fs.readFile('./index.html', function (err, html) {
		res.setHeader("Content-Type", "text/html");
		res.write(html);
  		res.end();
	});
})

app.post('/loginRegistration', urlencodedParser, function (req, res) { //если нажал кнопку "Войти\Регистрация", то откроется файл loginForm.html
	fs.readFile('./loginForm.html', function (err, html) {
		res.setHeader("Content-Type", "text/html");
		res.write(html);
		res.end();
	});
})

app.get('/registr', urlencodedParser, function (req, res) { //если перешел по ссылке "Вы у нас впервые? Зарегистрируйтесь, нажав на ссылку", то откроетс окно регистрации
	fs.readFile('./registrationForm.html', function (err, html) {
		res.setHeader("Content-Type", "text/html");
		res.write(html);
		res.end();
		
	});
})

app.post('/', urlencodedParser, function (req, res) { //если нажал на одну из кнопок форм, то кидает на главную
	fs.readFile('./index.html', function (err, html) {
		res.setHeader("Content-Type", "text/html");
		res.write(html);
		res.end();
		console.log(req.body);
		if (req.body.typeClient === 'login') { //проверка на тип пользователя логинится он или регистрируется
			let client = [req.body.name, req.body.surname, req.body.password] //парсинг данных из форм
			const connection = mysql.createConnection({//соединение с БД
			  host: "localhost", //хост
			  user: "root",//пользователь
			  database: "clients",//название БД
			  password: "qwerty",//пароль к БД
			  port: 3307//порт к БД
			});
			// тестирование подключения
			  connection.connect(function(err){//соединение с БД
			    if (err) {//проверка на ошибку
			      return console.error("Ошибка: " + err.message);//вывод ошибки
			    }
			    else{
			      console.log("Подключение к серверу MySQL успешно установлено");//вывод успешного подключения к БД
			    }
			 });
			  connection.execute('SELECT * FROM clients WHERE FIRST_NAME=(?) AND SURNAME=(?) AND PASSWORD_FIELD=(?)', client, function (err, results) { //выполнение SQL запроса на добавление клиента при регистрации
			  	if (err) {//проверка на ошибку
			  		console.log(err);//вывод ошибки
			  	} else {
			  		if (results.length === 0) {
			  			console.log('Неверные Имя, Фамилия или Пароль.');
			  		} else {
			  			console.log('Добро пожаловать!');
			  		}
			  	}
			  });
			 // закрытие подключения
			 connection.end(function(err) {
			  if (err) {
			    return console.log("Ошибка: " + err.message);
			  }
			  console.log("Подключение закрыто");
			});
		} else if (req.body.typeClient === 'register') {
			let client = [req.body.name, req.body.surname, req.body.password] //парсинг данных из форм
			const connection = mysql.createConnection({//соединение с БД
			  host: "localhost", //хост
			  user: "root",//пользователь
			  database: "clients",//название БД
			  password: "qwerty",//пароль к БД
			  port: 3307//порт к БД
			});
			// тестирование подключения
			  connection.connect(function(err){//соединение с БД
			    if (err) {//проверка на ошибку
			      return console.error("Ошибка: " + err.message);//вывод ошибки
			    }
			    else{
			      console.log("Подключение к серверу MySQL успешно установлено");//вывод успешного подключения к БД
			    }
			 });
			  connection.execute("INSERT INTO clients (FIRST_NAME, SURNAME, PASSWORD_FIELD) VALUES (?, ?, ?)",client, function (err, results) { //выполнение SQL запроса на добавление клиента при регистрации
			  	if (err) {//проверка на ошибку
			  		console.log(err);//вывод ошибки
			  	} else {
			  		console.log('Клиент добавлен!');//вывод успешного запроса
			  	}
			  });
			 // закрытие подключения
			 connection.end(function(err) {
			  if (err) {
			    return console.log("Ошибка: " + err.message);
			  }
			  console.log("Подключение закрыто");
			});
		}
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