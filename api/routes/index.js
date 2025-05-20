var express = require('express');
var router = express.Router();

const {Login, 
  SignUp, 
  ForgotPassword,
   ResetPassword
  } = require('../controllers/users');

/* POST login */
router.post('/login', (req,res) => {
  const supabase = req.app.get('supabase');
  Login(req,res,supabase);
});

/* POST signup */
router.post('/signup', (req,res) => {
  const supabase = req.app.get('supabase');
  SignUp(req,res,supabase);
} );

/* PUT /forgot */
router.post('/forgot-password', (req,res) => {
  const supabase = req.app.get('supabase');
  const transporter = req.app.get('transporter');
  ForgotPassword(req,res,supabase,transporter);
});


/* PUT /reset/:token */
router.put('/reset-password', (req,res) => {
  const supabase = req.app.get('supabase');
  ResetPassword(req,res,supabase);
});


module.exports = router;
