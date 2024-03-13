let express = require("express");
const dotenv = require('dotenv');
const path = require('path');
// const express = require('express');

const router = require('./routes/index');
const { auth } = require('express-openid-connect');

dotenv.config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json(),express.urlencoded({extended: true}));

const config = {
    authRequired: false,
    auth0Logout: true,
    session: {name: "atkoInsuranceCareSession"}
};

console.log(config);
console.log(process.env.CLIENT_ID);

const port = process.env.PORT || 3001;
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `13.36.208.72:${port}`;
}

app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
    res.locals.user = req.oidc.user;
    next();
  });
  
  app.use('/', router);
  
  // Catch 404 and forward to error handler
  app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: process.env.NODE_ENV !== 'production' ? err : {}
    });
  });

  app.listen(port, () => {
    console.log(`App is running ! Port ${port}`);
  });