const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

// require all models
const db = require('./models');

const app = express();

// configure middleware
// morgan for logging requests
app.use(logger('dev'));
// make public a static folder
app.use(express.static(__dirname + '/public'));
// parse req.body as json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// set handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const routes = require('./controllers/scraperController');
app.use(routes);

// connect to mongodb
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// make a route for saving a comment to the db and associating it with both a user and article

// make a route for seeing an article and associated comments

// make a route for seeing user profile with associated comments

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
