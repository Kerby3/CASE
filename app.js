let express = require('express');
const bodyParser = require('body-parser');
let app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

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

let login123 = '<h1>Регистрация</h1>'

app.get('/', function (req, res) {
	res.setHeader("Content-Type", "text/html");
    res.write("<!DOCTYPE html>");
    res.write("<html>");
    res.write("<head>");
    res.write("<title>Hello Node.js</title>");
    res.write("<meta charset=\"utf-8\" />");
    res.write("</head>");
    res.write("<body><form action=\"/register\" method=\"post\"><input name = \"click\"class=\"login\" type=\"submit\" value=\"Войти\\Регистрация\"></form></body>");
    res.write("</html>");
    res.end();
})

app.post('/register', urlencodedParser, function (req, res) {
	res.send(login123);
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

app.listen(3000, function () {
	console.log('API app started');
})