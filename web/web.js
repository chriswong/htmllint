var express = require('express');
var engines = require('consolidate');

var app = express();

app.engine('html', engines.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");

app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));

app.use('/', function(req, res) {
	res.render("home", {
		partials: {
			workspace: 'workspace',
			options: 'options',
			tests: 'tests',
			extending: 'extending'
		}
	});
});

app.listen(process.env.PORT || 3000);