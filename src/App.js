import logo from './logo.svg';
import './App.css';
import Login from './login';
import SignUp from './signUp';
import ForgotPassword from './forgotPassword';
import ResetPassword from './resetPassword';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={ <SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
