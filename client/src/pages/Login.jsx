import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { LoginUser } from "../redux/auth/AuthSlice";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  let navigate = useNavigate();

  const submitForm = async () => {
    try {
      axios.post(`${SERVER_URL}/api/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res['data'].message === 'Logged In'){
          dispatch(LoginUser({
            username: res.data.username,
            isAdmin: res.data.isAdmin
          }));

          console.log('saving username upon login. Response received: ', res['data']);
          if (res['data'].isAdmin) {
            return navigate('/admin/orders');
          } else {
            return navigate('/menu');
          }
        }
      })
    } catch(error) {
      console.log(error);
    }
  }
  // Handle form submission
  const handleSubmit = (e) => {
    // Prevent page refreshes
    e.preventDefault();
    submitForm();
  }


  return (
    <div className='h-screen bg-[#f5f5ef] pt-36'>
      <form className='px-6 py-8 h-fit w-96 mx-auto space-y-6 shadow-xl bg-white' onSubmit={handleSubmit}>
          <h1 className='text-2xl font-bold text-center'>Welcome Back!</h1>
          <div className='p-4 flex flex-row bg-[#eaeaea] rounded-3xl'>
            <FaUser className='text-xl mx-2 text-gray-500'/>
            <input type="text" className='bg-transparent w-full border-none outline-none' placeholder='Username'
              value={username} onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div>
            <div className='p-4 flex flex-row bg-[#eaeaea] rounded-3xl'>
              <FaLock className='text-xl mx-2 text-gray-500'/>
              <input type="password" className='bg-transparent w-full border-none outline-none' placeholder='Password'
                value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button className='float-right'><p className='px-2 py-2 text-sm text-right hover:underline'>Forgot Password?</p></button>
          </div>
          <div className='clear-right'>
            <button type="submit" className='px-12 py-2 mx-auto mt-12 bg-[#545454] text-white block rounded-3xl'>LOGIN</button>
            <Link to='/register'><p className='my-4 text-center text-xs hover:underline'>Not a Member? Create Account</p></Link>
          </div>
        </form>
    </div>
  )
}

export default Login