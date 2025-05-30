import {useState} from 'react';
import './signUp.css'
import axios from 'axios';
import Logo from './Images/logo.png'
import {useNavigate} from 'react-router-dom'
const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
                fullName,
                email, 
                password
            });
            navigate('/dashboard')
            
        } catch (err) {
            console.error('Full signup error:', err);
            console.log('Error response data:', err.response?.data);
            alert(err.response?.data?.error || 'Signup failed');
        }
    };
    return (
    <>
        <form onSubmit={handleSubmit}>
            <div>
                <img src={Logo} alt="Logo" style={{
                    width: '180px',
                    height: '150px',
                }}/>
            </div>
            <h1>Create an account</h1>
            <h3>Already have an account? <a href="/login">Login</a></h3>
            <div>
                <input 
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter Full Name" 
                    required
                /> 
            </div>
            <div>
                <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter Email Address" 
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
        </form>
    </>   
    )
}
export default SignUp