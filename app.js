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
	let sumOfSalaryWithAdmin = 0;
	let averageSalaryWithAdmin = 0;
	let sumOfSalaryWithoutAdmin = 0;
	let averageSalaryWithoutAdmin = 0;
	let options = '';
	let countWithoutAdmin = 0;
	let institutions = [];
	let uniqueInstitutions = [];
	let minimalWage = 12792;
	let peopleWithMinimalWage = 0;
	let peopleWithoutMinimalWage = 0;
	let percentPeopleWithMinimalWage = 0;
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
			  			options += `<option value="${results[0].INSTITUTION}">${results[0].INSTITUTION}</option>`;
			  			sumOfSalaryWithAdmin = results[0].SALARY;
			  			if (results[0].isAdmin === '0') {
			  				sumOfSalaryWithoutAdmin = results[0].SALARY;
			  				countWithoutAdmin = 1;
			  			}
			  			if (results[0].SALARY >= minimalWage) {
			  				peopleWithMinimalWage = 1;
			  			} else {
			  				peopleWithoutMinimalWage = 1;
			  			}
			  		} else {
				  		for (let i = 0; i < results.length; i += 1) {
				  			institutions.push(results[i].INSTITUTION);
				  			sumOfSalaryWithAdmin += parseInt(results[i].SALARY);
				  			if (results[i].isAdmin === '0') {
				  				sumOfSalaryWithoutAdmin += parseInt(results[i].SALARY);
				  				countWithoutAdmin += 1;
				  			}
				  			if (results[i].SALARY >= minimalWage) {
				  				peopleWithMinimalWage += 1;
				  			} else {
				  				peopleWithoutMinimalWage += 1;
				  			}
				  		}
				  		uniqueInstitutions = [...new Set(institutions)];
				  		for (let j = 0; j < uniqueInstitutions.length; j += 1) {
				  			options += `<option value=${uniqueInstitutions[j]}>${uniqueInstitutions[j]}</option>\n`
				  		}
			  		}
			  	}
			  	//console.log(options);
			  	percentPeopleWithMinimalWage = (peopleWithMinimalWage / (peopleWithMinimalWage + peopleWithoutMinimalWage)) * 100;
			  	percentPeopleWithMinimalWage = percentPeopleWithMinimalWage.toFixed(2);
			  	if (peopleWithMinimalWage === 1 && peopleWithoutMinimalWage === 0) {
			  		percentPeopleWithMinimalWage = 0;
			  	}
			  	averageSalaryWithAdmin = sumOfSalaryWithAdmin / results.length;
			  	averageSalaryWithAdmin = averageSalaryWithAdmin.toFixed(2);
			  	averageSalaryWithoutAdmin = sumOfSalaryWithoutAdmin / countWithoutAdmin;
			  	averageSalaryWithoutAdmin = averageSalaryWithoutAdmin.toFixed(2);
			  	if (sumOfSalaryWithoutAdmin === 0 || sumOfSalaryWithoutAdmin === NaN) {
			  		averageSalaryWithoutAdmin = 'Нет персонала';
			  	}
			  	if (sumOfSalaryWithAdmin === 0 || sumOfSalaryWithAdmin === NaN) {
			  		averageSalaryWithAdmin = 'Нет персонала';
			  	}
			  	res.render('index.hbs', {
					avgSalaryWithAdmin : averageSalaryWithAdmin,
					avgSalaryWithoutAdmin: averageSalaryWithoutAdmin,
					peopleWithMinimalWage: peopleWithMinimalWage,
					percentPeopleWithMinimalWage: percentPeopleWithMinimalWage,
					options: options
				});
			})
			  	connection.end(function(err) {
				if (err) {
				  return console.log("Ошибка: " + err.message);
				}
				console.log("Подключение закрыто");
			});
	console.log(averageSalaryWithAdmin);
	
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
	let sumOfSalaryWithAdmin = 0;
	let averageSalaryWithAdmin = 0;
	let sumOfSalaryWithoutAdmin = 0;
	let averageSalaryWithoutAdmin = 0;
	let countWithoutAdmin = 0;
	let minimalWage = 12792;
	let peopleWithMinimalWage = 0;
	let peopleWithoutMinimalWage = 0;
	let percentPeopleWithMinimalWage = 0;
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
							  			options += `<option value="${results[0].INSTITUTION}">${results[0].INSTITUTION}</option>`;
							  			sumOfSalaryWithAdmin = results[0].SALARY;
							  			if (results[0].isAdmin === '0') {
							  				sumOfSalaryWithoutAdmin = results[0].SALARY;
							  				countWithoutAdmin = 1;
							  			}
							  			if (results[0].SALARY >= minimalWage) {
							  				peopleWithMinimalWage = 1;
							  			} else {
							  				peopleWithoutMinimalWage = 1;
							  			}
							  		} else {
								  		for (let i = 0; i < results.length; i += 1) {
								  			institutions.push(results[i].INSTITUTION);
								  			sumOfSalaryWithAdmin += parseInt(results[i].SALARY);
								  			if (results[i].isAdmin === '0') {
								  				sumOfSalaryWithoutAdmin += parseInt(results[i].SALARY);
								  				countWithoutAdmin += 1;
								  			}
								  			if (results[i].SALARY >= minimalWage) {
								  				peopleWithMinimalWage += 1;
								  			} else {
								  				peopleWithoutMinimalWage += 1;
								  			}
								  		}
								  		uniqueInstitutions = [...new Set(institutions)];
								  		for (let j = 0; j < uniqueInstitutions.length; j += 1) {
								  			options += `<option value=${uniqueInstitutions[j]}>${uniqueInstitutions[j]}</option>\n`
								  		}
							  		}
							  	}
							  	percentPeopleWithMinimalWage = (peopleWithMinimalWage / (peopleWithMinimalWage + peopleWithoutMinimalWage)) * 100;
							  	percentPeopleWithMinimalWage = percentPeopleWithMinimalWage.toFixed(2);
							  	if (peopleWithMinimalWage === 1 && peopleWithoutMinimalWage === 0) {
							  		percentPeopleWithMinimalWage = 0;
							  	}
							  	averageSalaryWithAdmin = sumOfSalaryWithAdmin / results.length;
							  	averageSalaryWithAdmin = averageSalaryWithAdmin.toFixed(2);
							  	averageSalaryWithoutAdmin = sumOfSalaryWithoutAdmin / countWithoutAdmin;
							  	averageSalaryWithoutAdmin = averageSalaryWithoutAdmin.toFixed(2);
							  	if (sumOfSalaryWithoutAdmin === 0 || sumOfSalaryWithoutAdmin === NaN) {
							  		averageSalaryWithoutAdmin = 'Нет персонала';
							  	}
							  	if (sumOfSalaryWithAdmin === 0 || sumOfSalaryWithAdmin === NaN) {
							  		averageSalaryWithAdmin = 'Нет персонала';
							  	}
							  	res.render('indexRegistrationSuccess.hbs', {
							  		successClient: `${client[0]} ${client[1]}`,
									avgSalaryWithAdmin : averageSalaryWithAdmin,
									avgSalaryWithoutAdmin: averageSalaryWithoutAdmin,
									peopleWithMinimalWage: peopleWithMinimalWage,
									percentPeopleWithMinimalWage: percentPeopleWithMinimalWage,
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
			console.log(req.body);
			let sumOfSalaryWithAdmin = 0;
			let averageSalaryWithAdmin = 0;
			let sumOfSalaryWithoutAdmin = 0;
			let averageSalaryWithoutAdmin = 0;
			let countWithoutAdmin = 0;
			let options = [];
			let institutions = [];
			let hashedPassword = passwordHash.generate(req.body.password);
			let minimalWage = 12792;
			let peopleWithMinimalWage = 0;
			let peopleWithoutMinimalWage = 0;
			let percentPeopleWithMinimalWage = 0;
			//console.log(hashedPassword.length);
			let client = [req.body.name, req.body.surname, hashedPassword, req.body.salary, req.body.institution, req.body.isAdminCheckBox] //парсинг данных из форм
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
			  connection.execute("INSERT INTO clients (FIRST_NAME, SURNAME, PASSWORD_FIELD, SALARY, INSTITUTION, isAdmin) VALUES (?, ?, ?, ?, ?, ?)",client, function (err, results) { //выполнение SQL запроса на добавление клиента при регистрации
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
							  			options += `<option value="${results[0].INSTITUTION}">${results[0].INSTITUTION}</option>`;
							  			sumOfSalaryWithAdmin = results[0].SALARY;
							  			if (results[0].isAdmin === '0') {
							  				sumOfSalaryWithoutAdmin = results[0].SALARY;
							  				countWithoutAdmin = 1;
							  			}
							  			if (results[0].SALARY >= minimalWage) {
							  				peopleWithMinimalWage = 1;
							  			} else {
							  				peopleWithoutMinimalWage = 1;
							  			}
							  		} else {
								  		for (let i = 0; i < results.length; i += 1) {
								  			institutions.push(results[i].INSTITUTION);
								  			sumOfSalaryWithAdmin += parseInt(results[i].SALARY);
								  			if (results[i].isAdmin === '0') {
								  				sumOfSalaryWithoutAdmin += parseInt(results[i].SALARY);
								  				countWithoutAdmin += 1;
								  			}
								  			if (results[i].SALARY >= minimalWage) {
								  				peopleWithMinimalWage += 1;
								  			} else {
								  				peopleWithoutMinimalWage += 1;
								  			}
								  		}
								  		uniqueInstitutions = [...new Set(institutions)];
								  		for (let j = 0; j < uniqueInstitutions.length; j += 1) {
								  			options += `<option value=${uniqueInstitutions[j]}>${uniqueInstitutions[j]}</option>\n`
								  		}
							  		}
							  	}
							  	percentPeopleWithMinimalWage = (peopleWithMinimalWage / (peopleWithMinimalWage + peopleWithoutMinimalWage)) * 100;
							  	percentPeopleWithMinimalWage = percentPeopleWithMinimalWage.toFixed(2);
							  	if (peopleWithMinimalWage === 1 && peopleWithoutMinimalWage === 0) {
							  		percentPeopleWithMinimalWage = 0;
							  	}
							  	averageSalaryWithAdmin = sumOfSalaryWithAdmin / results.length;
							  	averageSalaryWithAdmin = averageSalaryWithAdmin.toFixed(2);
							  	averageSalaryWithoutAdmin = sumOfSalaryWithoutAdmin / countWithoutAdmin;
							  	averageSalaryWithoutAdmin = averageSalaryWithoutAdmin.toFixed(2);
							  	if (sumOfSalaryWithoutAdmin === 0 || sumOfSalaryWithoutAdmin === NaN) {
							  		averageSalaryWithoutAdmin = 'Нет персонала';
							  	}
							  	if (sumOfSalaryWithAdmin === 0 || sumOfSalaryWithAdmin === NaN) {
							  		averageSalaryWithAdmin = 'Нет персонала';
							  	}
							  	res.render('indexRegistrationSuccess.hbs', {
							  		successClient: `${client[0]} ${client[1]}`,
									avgSalaryWithAdmin : averageSalaryWithAdmin,
									avgSalaryWithoutAdmin: averageSalaryWithoutAdmin,
									peopleWithMinimalWage: peopleWithMinimalWage,
									percentPeopleWithMinimalWage: percentPeopleWithMinimalWage,
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
			let sumOfSalaryWithAdmin = 0;
			let averageSalaryWithAdmin = 0;
			let sumOfSalaryWithoutAdmin = 0;
			let averageSalaryWithoutAdmin = 0;
			let countWithoutAdmin = 0;
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
						  			options += `<option value="${results[0].INSTITUTION}">${results[0].INSTITUTION}</option>`;
						  			sumOfSalaryWithAdmin = results[0].SALARY;
						  			if (results[0].isAdmin === '0') {
						  				sumOfSalaryWithoutAdmin = results[0].SALARY;
						  				countWithoutAdmin = 1;
						  			}
						  		} else {
							  		for (let i = 0; i < results.length; i += 1) {
							  			institutions.push(results[i].INSTITUTION);
							  			sumOfSalaryWithAdmin += parseInt(results[i].SALARY);
							  			if (results[i].isAdmin === '0') {
							  				sumOfSalaryWithoutAdmin += parseInt(results[i].SALARY);
							  				countWithoutAdmin += 1;
							  			}
							  		}
							  		uniqueInstitutions = [...new Set(institutions)];
							  		for (let j = 0; j < uniqueInstitutions.length; j += 1) {
							  			options += `<option value=${uniqueInstitutions[j]}>${uniqueInstitutions[j]}</option>\n`
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

app.post('/avgSalaryInstitution', urlencodedParser, (req, res) => {
	let minimalWage = 12792;
	let peopleWithMinimalWage = 0;
	let peopleWithoutMinimalWage = 0;
	let percentPeopleWithMinimalWage = 0;
	let sumOfSalaryWithAdmin = 0;
	let averageSalaryWithAdmin = 0;
	let sumOfSalaryWithoutAdmin = 0;
	let averageSalaryWithoutAdmin = 0;
	let countWithoutAdmin = 0;

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
	//connection.config.namedPlaceholders = true;
	connection.execute(`SELECT * FROM clients WHERE INSTITUTION='${req.body.institutionSelector}'`, function (err, results) { //выполнение SQL запроса на поиск клиента
		if (err) {//проверка на ошибку
			console.log(err);//вывод ошибки
		} else {
			let averageSalaryInstitution = 0;
			let sumOfSalaryInstitution = 0;
			if (results.length === 1) {
				sumOfSalaryInstitution = results[0].SALARY;
				sumOfSalaryWithAdmin = results[0].SALARY;
			  	if (results[0].isAdmin === '0') {
			  		sumOfSalaryWithoutAdmin = results[0].SALARY;
			  		countWithoutAdmin = 1;
			  	}
			  	if (results[0].SALARY >= minimalWage) {
			  		peopleWithMinimalWage = 1;
			  	} else {
			  		peopleWithoutMinimalWage = 1;
			  	}
			} else {
				for (let i = 0; i < results.length; i++) {
					sumOfSalaryInstitution += results[i].SALARY;
					if (results[i].isAdmin === '0') {
				  		sumOfSalaryWithoutAdmin += parseInt(results[i].SALARY);
				  		countWithoutAdmin += 1;
				  	}
				  	if (results[i].SALARY >= minimalWage) {
				  		peopleWithMinimalWage += 1;
				  	} else {
				  		peopleWithoutMinimalWage += 1;
				  	}
				}
			}
			averageSalaryInstitution = sumOfSalaryInstitution / results.length;
			percentPeopleWithMinimalWage = (peopleWithMinimalWage / (peopleWithMinimalWage + peopleWithoutMinimalWage)) * 100;
			percentPeopleWithMinimalWage = percentPeopleWithMinimalWage.toFixed(2);
			if (peopleWithMinimalWage === 1 && peopleWithoutMinimalWage === 0) {
				percentPeopleWithMinimalWage = 0;
			}
			averageSalaryWithAdmin = sumOfSalaryWithAdmin / results.length;
			averageSalaryWithAdmin = averageSalaryWithAdmin.toFixed(2);
			averageSalaryWithoutAdmin = sumOfSalaryWithoutAdmin / countWithoutAdmin;
			averageSalaryWithoutAdmin = averageSalaryWithoutAdmin.toFixed(2);
			if (sumOfSalaryWithoutAdmin === 0 || sumOfSalaryWithoutAdmin === NaN) {
				averageSalaryWithoutAdmin = 'Нет персонала';
			}
			if (sumOfSalaryWithAdmin === 0 || sumOfSalaryWithAdmin === NaN) {
				averageSalaryWithAdmin = 'Нет персонала';
			}
			res.render('avgSalaryInstitution.hbs', {
				institution: req.body.institutionSelector,
				avgSalaryInsitution: averageSalaryInstitution,
				avgSalaryWithoutAdmin: averageSalaryWithoutAdmin,
				peopleWithMinimalWage: peopleWithMinimalWage,
				percentPeopleWithMinimalWage: percentPeopleWithMinimalWage
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

/*app.use('avgSalaryInstitution', (req, res) => {
	res.render('avgSalaryInstitution.hbs', {

	})
})

app.get('/artists', function (req, res) {
	res.send(artists);
})*/

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