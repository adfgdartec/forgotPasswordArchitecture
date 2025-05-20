import {useState} from 'react'
import './login.css'
import axios from 'axios';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post(`${process.env.REACT_APP_API_URL}auth/login`, {
                email,
                password
            })
        } catch(err){
            alert(err.response?.data?.error || 'Login failed');
        }
    };
    return (
    <>
            <form onSubmit={handleSubmit}>
                <h1>Welcome back</h1>
                <h3>Don't have an account? <a href="/signup">Sign up</a></h3>
                <div>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="Enter Email"
                        required
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="Enter password" 
                        required
                    />
                </div>
            <button type="submit">Submit</button>
            <div style={{
                textAlign: 'center', 
                marginTop: '20px'
                }}>
                <a href="/forgot-password" style={{
                    textDecoration: 'none', 
                    color: '#666666',
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                    }}>Forgot your password?</a>
            </div>
            </form>
    </>   
    )
}
export default Login
