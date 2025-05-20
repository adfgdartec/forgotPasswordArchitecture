import {useState} from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.put(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
                token, 
                newPassword
            });
            alert('Password reset successful!');
        } catch(err) {
            alert(err.response?.data?.error || 'Reset password request failed');
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <input 
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)} 
                        placeholder="New password" 
                        autofocus
                    />
                </div>
                <div>
                    <button type="submit">Reset Password</button>
                </div>
            </form>
        </>
    )

}
export default ResetPassword
