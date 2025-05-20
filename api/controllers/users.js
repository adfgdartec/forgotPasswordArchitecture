const crypto = require('crypto');
const bcrypt = require('bcrypt');


const SignUp = async (req, res, supabase) => {
    try {
      const { email, password, fullName } = req.body;
      console.log('Signup request:', { email, fullName });
  
      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const { data: existingUser, error: existingError } = await supabase
        .schema('api')
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
  
      if (existingError && existingError.code !== 'PGRST116') {
        console.error('Error checking existing user:', existingError);
        return res.status(500).json({ error: 'Internal server error checking existing user', details: existingError.message });
      }
  
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const { data, error } = await supabase
        .schema('api')
        .from('users')
        .insert([{ email, full_name: fullName, password: hashedPassword }])
        .select(); 
  
      if (error) {
        console.error('Error inserting user:', error);
        return res.status(500).json({ error: 'Failed to create user', details: error.message });
      }
  
  
      res.status(201).json({ message: 'Signup successful', user: data[1] });
  
    } catch (err) {
      console.error('Unexpected signup error:', err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  };

// === LOGIN ===
const Login = async (req, res, supabase) => {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
        .schema('api')
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !user) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', user });
};

// === FORGOT PASSWORD ===
const ForgotPassword = async (req, res, supabase, transporter) => {
    const { email } = req.body;

    const { data: user, error } = await supabase
        .schema('api')
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (error || !user) {
        return res.status(404).json({ error: 'No user found with this email' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const { error: upsertError } = await supabase
        .schema('api')
        .from('password_reset_tokens')
        .upsert({
            email,
            token,
            expires_at: expires.toISOString()
        });

    if (upsertError) {
        console.error('Token upsert error:', upsertError);
        return res.status(500).json({ error: 'Error generating reset token' });
    }

    const resetLink = `${process.env.RESET_PASSWORD_URL}/?token=${token}`;

    await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Password Reset',
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
    });

    res.json({ message: 'Password reset link sent to your email' });
};

// === RESET PASSWORD ===
const ResetPassword = async (req, res, supabase) => {
    const { token, newPassword } = req.body;

    const { data: resetData, error } = await supabase
        .schema('api')
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .single();

    if (error || !resetData || new Date(resetData.expires_at) < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
        .schema('api')
        .from('users')
        .update({ password: hashedPassword })
        .eq('email', resetData.email);

    if (updateError) {
        console.error('Password update error:', updateError);
        return res.status(500).json({ error: 'Error updating password' });
    }

    await supabase
        .schema('api')
        .from('password_reset_tokens')
        .delete()
        .eq('token', token);

    res.json({ message: 'Password has been reset successfully' });
};


module.exports = {
    SignUp,
    Login,
    ForgotPassword,
    ResetPassword,
};
