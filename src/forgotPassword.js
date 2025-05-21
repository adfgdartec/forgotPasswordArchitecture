import {useState} from 'react';
import axios from 'axios';
import Logo from './Images/logo.png';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
                email
            })
            alert('Check your email for a reset link.');
        } catch(err) {
            alert(err.response?.data?.error || 'Forgot password request failed');
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <img src={Logo} alt="Logo" style={{
                        width: '180px',
                        height: '150px',
                    }}/>    
                </div>
                <h1>Forgot Password</h1>    
                <div>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus/>
                </div>
                <div>
                    <button type="submit">Send Reset Password Email</button>
                </div>
            </form>
        </>
    )
}
export default ForgotPassword