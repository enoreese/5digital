const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const userRoutes = require('./routes/user');
const mainRoutes = require('./routes/main');
// const orderRoutes = require('./routes/order');
// const servicesRoutes = require('./routes/services');
const config = require('./config/secret');

const app = express();
const sessionStore = new MongoStore({ url: config.database, autoReconnect: true });

const sessionMiddleware = session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
  store: sessionStore
})

//Connection to the DB
mongoose.connect(config.database, function (err) {
  if (err) console.log(err);
  console.log("Connected to the database");
});


// Various Library Use
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

//saves the user session
app.use(sessionMiddleware);

//Passport Config
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

//local function
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//Using the routes
app.use(userRoutes);
app.use(mainRoutes);
// app.use(servicesRoutes);
// app.use(orderRoutes);


//Server listener
app.listen(config.port, (err) => {
  if (err) console.log(err);
  console.log(`Running on port ${config.port}`);
});