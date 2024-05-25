const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const routes = require('./routes');
const Training = require('./models/training'); 

const app = express();
const path = require('path');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



mongoose.connect('mongodb://localhost/fitness', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/fitness' })
}));

// Middleware to make the user available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use('/', routes);
app.get('/', async (req, res) => {
    const { city, type } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (type) filter.type = type;

    const trainings = await Training.find(filter);
    const cities = await Training.distinct('city');
    const types = await Training.distinct('type');

    res.render('index', { trainings, cities, types, selectedCity: city, selectedType: type });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});






