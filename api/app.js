require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const indexRouter = require('./routes/index');

const app = express();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('SUPABASE_URL:', supabaseUrl); 
console.log('SUPABASE_KEY:', supabaseKey?.slice(0, 10), '...'); 

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);
app.set('supabase', supabase);
console.log('Supabase client created');

//Nodemailer with Resend SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 587,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY
  }
});
app.set('transporter', transporter);
console.log('Nodemailer transporter created');

app.use(cors({
  origin: 'http://localhost:3000', // or your frontend port
  credentials: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

module.exports = app;
