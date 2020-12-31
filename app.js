let express = require('express');//подключение компонентов
const bodyParser = require('body-parser');//подключение компонентов
let app = express();//подключение компонентов
const urlencodedParser = bodyParser.urlencoded({extended: false});//подключение компонентов
let http = require('http');//подключение компонентов
let fs = require('fs');//подключение компонентов
const mysql = require("mysql2");//подключение компонентов
const passwordHash = require( 'password-hash' );
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use('public', express.static('public'));
app.use(express.static(__dirname + '/public'));


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

app.use('/qwa', (req, res) => {
	res.render('indexRegistrationSuccess.hbs', {
		successClient: 'aaa'
	});
}); 

app.get('/', function (req, res) { // если зашел на главную страницу по ссылке
	let sumOfSalary = 0;
	let averageSalary = 0;
	let options = '';
	let institutions = [];
	let uniqueInstitutions = [];
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

			  connection.execute('SELECT * FROM clients', function (err, results) { //выполнение SQL запроса на поиск клиента
			  	if (err) {//проверка на ошибку
			  		console.log(err);//вывод ошибки
			  	} else {
			  		if (results.length === 1) {
			  			sumOfSalary = results[0].SALARY;
			  			options += `<option value="${results[0].INSTITUTION}">${results[0].INSTITUTION}</option>`;
			  		} else {
				  		for (let i = 0; i < results.length; i += 1) {
				  			sumOfSalary += parseInt(results[i].SALARY);
				  			institutions.push(results[i].INSTITUTION);
				  		}
				  		uniqueInstitutions = [...new Set(institutions)];
				  		for (let j = 0; j < uniqueInstitutions.length; j += 1) {
				  			options += `<option value=${uniqueInstitutions[j]}>${uniqueInstitutions[j]}</option>\n`
				  		}
			  		}
			  	}
			  	//console.log(options);
			  	averageSalary = sumOfSalary / results.length;
			  	res.render('index.hbs', {
					avgSalary : averageSalary,
					options: options
				});
			})
			  	connection.end(function(err) {
				if (err) {
				  return console.log("Ошибка: " + err.message);
				}
				console.log("Подключение закрыто");
			});
	console.log(averageSalary);
	
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
	/*fs.readFile('./index.html', function (err, html) {
		res.setHeader("Content-Type", "text/html");
		res.write(html);
		res.end();*/
		let sumOfSalary = 0;
		let averageSalary = 0;
		//console.log(req.body);
		if (req.body.typeClient === 'login') { //проверка на тип пользователя логинится он или регистрируется
			let hashedPassword = passwordHash.generate(req.body.password);
			let client = [req.body.name, req.body.surname];
			let options = '';
			let institutions = [];
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


			  


			  connection.execute('SELECT * FROM clients WHERE FIRST_NAME=(?) AND SURNAME=(?)', client, function (err, results) { //выполнение SQL запроса на поиск клиента
			  	if (err) {//проверка на ошибку
			  		console.log(err);//вывод ошибки
			  	} else {
			  		//console.log(results);
			  		if (results.length === 0) {
			  			/*fs.readFile('./loginFormLose.html', (err, html) => {
			  				res.setHeader("Content-Type", "text/html");
							res.write(html);
							res.end();
			  			})*/

			  			res.render('loginFormLose.hbs', {

			  			})

			  		} else {
			  			for (let i = 0; i < results.length; i += 1) {
			  				if (passwordHash.verify(req.body.password, results[i].PASSWORD_FIELD) === true) {
			  					console.log(`Welcome! ${client[0]} ${client[1]}`);

			  					const connection = mysql.createConnection({//соединение с БД
								  host: "localhost", //хост
								  user: "root",//пользователь
								  database: "clients",//название БД
								  password: "qwerty",//пароль к БД
								  port: 3307//порт к БД
								});

								connection.connect(function(err){//соединение с БД
							    if (err) {//проверка на ошибку
							      return console.error("Ошибка: " + err.message);//вывод ошибки
							    }
							    else{
							      console.log("Подключение к серверу MySQL успешно установлено");//вывод успешного подключения к БД
							    }
							 });

							  connection.execute('SELECT * FROM clients', function (err, results) { //выполнение SQL запроса на поиск клиента
							  	if (err) {//проверка на ошибку
							  		console.log(err);//вывод ошибки
							  	} else {
							  		//console.log(results);
							  		if (results.length === 1) {
							  			sumOfSalary = results[0].SALARY;
							  			options += `<option value="${results[0].INSTITUTION}">${results[0].INSTITUTION}</option>`;
							  		} else {
								  		for (let i = 0; i < results.length; i += 1) {
								  			sumOfSalary += parseInt(results[i].SALARY);
								  			institutions.push(results[i].INSTITUTION);
								  		}
								  		let uniqueInstitutions = [...new Set(institutions)];
								  		for (let j = 0; j < uniqueInstitutions.length; j += 1) {
								  			options += `<option value="${uniqueInstitutions[j]}">${uniqueInstitutions[j]}</option>\n`;
								  		}
							  		}
							  	}
							  	averageSalary = sumOfSalary / results.length;
							  	res.render('indexRegistrationSuccess.hbs', {
									successClient: `${client[0]} ${client[1]}`,
									avgSalary : averageSalary,
									options: options
								});
							})
							  	connection.end(function(err) {
								if (err) {
								  return console.log("Ошибка: " + err.message);
								}
								console.log("Подключение закрыто");
							});


			  					break;
			  				} else {
			  					if (i === results.length - 1) {
			  						/*fs.readFile('./loginFormLose.html', (err, html) => {
						  				res.setHeader("Content-Type", "text/html");
										res.write(html);
										res.end();
						  			})*/
						  			res.render('loginFormLose.hbs', {
			  				
			  						})
			  					}
			  					continue;
			  				}
			  			}
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
			let sumOfSalary = 0;
			let averageSalary = 0;
			let options = [];
			let institutions = [];
			let hashedPassword = passwordHash.generate(req.body.password);
			//console.log(hashedPassword.length);
			let client = [req.body.name, req.body.surname, hashedPassword, req.body.salary, req.body.institution] //парсинг данных из форм
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
			  connection.execute("INSERT INTO clients (FIRST_NAME, SURNAME, PASSWORD_FIELD, SALARY, INSTITUTION) VALUES (?, ?, ?, ?, ?)",client, function (err, results) { //выполнение SQL запроса на добавление клиента при регистрации
			  	if (err) {//проверка на ошибку
			  		console.log(err);//вывод ошибки
			  	} else {

			  		const connection = mysql.createConnection({//соединение с БД
								  host: "localhost", //хост
								  user: "root",//пользователь
								  database: "clients",//название БД
								  password: "qwerty",//пароль к БД
								  port: 3307//порт к БД
								});

								connection.connect(function(err){//соединение с БД
							    if (err) {//проверка на ошибку
							      return console.error("Ошибка: " + err.message);//вывод ошибки
							    }
							    else{
							      console.log("Подключение к серверу MySQL успешно установлено");//вывод успешного подключения к БД
							    }
							 });

							  connection.execute('SELECT * FROM clients', function (err, results) { //выполнение SQL запроса на поиск клиента
							  	if (err) {//проверка на ошибку
							  		console.log(err);//вывод ошибки
							  	} else {
							  		//console.log(results);
							  		if (results.length === 1) {
							  			sumOfSalary = results[0].SALARY;
							  			options += `<option value="${results[0].INSTITUTION}">${results[0].INSTITUTION}</option>`;
							  		} else {
								  		for (let i = 0; i < results.length; i += 1) {
								  			sumOfSalary += parseInt(results[i].SALARY);
								  			institutions.push(results[i].INSTITUTION);
								  		}
								  		let uniqueInstitutions = [...new Set(institutions)];
								  		for (let j = 0; j < uniqueInstitutions.length; j += 1) {
								  			options += `<option value="${uniqueInstitutions[j]}">${uniqueInstitutions[j]}</option>\n`;
								  		}
							  		}
							  	}
							  	averageSalary = sumOfSalary / results.length;
							  	res.render('indexRegistrationSuccess.hbs', {
									successClient: `${client[0]} ${client[1]}`,
									avgSalary : averageSalary,
									options: options
								});
							})
							  	connection.end(function(err) {
								if (err) {
								  return console.log("Ошибка: " + err.message);
								}
								console.log("Подключение закрыто");
							});

			  	}
			  });
			 // закрытие подключения
			 connection.end(function(err) {
			  if (err) {
			    return console.log("Ошибка: " + err.message);
			  }
			  console.log("Подключение закрыто");
			});
		} else if (req.body.typeClient !== 'register' && req.body.typeClient !== 'login') {
			let institutions = [];
			let options = '';
			let sumOfSalaryInstitution = 0;
			let sumOfSalaryInstitutions = [];
			let averageSalaryInstitution = [];
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

					  connection.execute('SELECT * FROM clients', function (err, results) { //выполнение SQL запроса на поиск клиента
					  	if (err) {//проверка на ошибку
					  		console.log(err);//вывод ошибки
					  	} else {
					  		//console.log(results);
					  		if (results.length === 1) {
					  			sumOfSalary = results[0].SALARY;
					  			averageSalaryInstitution.push(sumOfSalary);
					  			options += `<option value="${results[0].INSTITUTION}">${results[0].INSTITUTION}</option>`;
					  		} else {
					  			for (let j = 0; j < results.length; j += 1) {
									institutions.push(results[j].INSTITUTION);
									sumOfSalary += parseInt(results[j].SALARY);
								}
								let uniqueInstitutions = [...new Set(institutions)];
						  		for (let i = 0; i < uniqueInstitutions.length; i += 1) {
						  			options += `<option value="${uniqueInstitutions[i]}">${uniqueInstitutions[i]}</option>\n`;
						  			//console.log(uniqueInstitutions[i]);

						  			/*
									});*/

						  		}
						  		
					  		}
					  	}
					  	//console.log(options);
						//console.log(req.body);
					})
					  	connection.end(function(err) {
						if (err) {
						  return console.log("Ошибка: " + err.message);
						}
						console.log("Подключение закрыто");
					});
			}
	
})

app.post('/avgSalaryInstitution',urlencodedParser, (req, res) => {
	console.log(req.body.institutionSelector);

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
	    } else{
		    console.log("Подключение к серверу MySQL успешно установлено");//вывод успешного подключения к БД
		}
	});
	//console.log('aaaa');
	connection.config.namedPlaceholders = true;
	connection.execute(`SELECT * FROM clients WHERE INSTITUTION='${req.body.institutionSelector}'`, function (err, results) { //выполнение SQL запроса на поиск клиента
		if (err) {//проверка на ошибку
			console.log(err);//вывод ошибки
		} else {
			let averageSalaryInstitution = 0;
			let sumOfSalaryInstitution = 0;
			if (results.length === 1) {
				sumOfSalaryInstitution = results[0].SALARY;
			} else {
				for (let i = 0; i < results.length; i++) {
					sumOfSalaryInstitution += results[i].SALARY; 
				}
			}
			averageSalaryInstitution = sumOfSalaryInstitution / results.length;
			res.render('avgSalaryInstitution.hbs', {
				institution: req.body.institutionSelector,
				avgSalaryInsitution: averageSalaryInstitution
			})
		}
	});
	connection.end(function(err) {
		if (err) {
		  return console.log("Ошибка: " + err.message);
		}
	console.log("Подключение закрыто");

	});
});

app.get('/artists', function (req, res) {
	res.send(artists);
})

/*app.post('/monitoring', urlencodedParser, (req, res) => {
	res.render('monitor.hbs', {
		avgSalary: `${req.body.avgSalary}`
	})
	console.log(req.body);
})*/

/*app.use('/enteringData', (req, res) => {
	res.render('enterData.hbs', {
		
	});
});

app.get('/regSuccess', (req, res) => {
	res.render('indexRegistrationSuccess.hbs', {

	});

})*/

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