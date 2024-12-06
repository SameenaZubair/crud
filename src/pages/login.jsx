import React, {useState} from 'react'
import {Login} from "../utility/firebaseAuth"
import {useNavigate} from 'react-router-dom'

const LogIn = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const  [error, setError] = useState(null);
  const navigate = useNavigate()

  const handleLogin = async (e) =>{
    e.preventDefault();
    try {
      const user = await Login(email, password);  //call firebase login function
      alert("Login Successful!!");
      console.log("User:", user);
      navigate("/dashboard");
    }catch (err){
      setError(err.message)   //display error
    }
  }
  return (
   <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-500 to-slate-400'>
    <form  onSubmit={handleLogin} className='w-full max-w-sm p-4 border shadow-md hover:bg-purple-400 duration-1200'>
      <h2 className='text-xl text-center font-bold mb-4'>Login</h2>
      {error && <p className='text-red-500 mb-2'>{error}</p>}
      <input
     type='email'
     placeholder='Enter Your Email'
     value={email}
     onChange={(e) => setEmail(e.target.value)}
    className='w-full p-2 text-center border rounded mb-3'
    />
    <input
     type='password'
     placeholder='Enter Your Password'
     value={password}
     onChange={(e) => setPassword(e.target.value)}
    className='w-full p-2 text-center border rounded mb-3'
    />       
    <button type="submit" className='w-full p-2 bg-blue-500 text-white rounded'>Login</button>                                                                                            
    </form>
   </div>
  )
}

export default LogIn




