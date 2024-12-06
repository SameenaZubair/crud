import React from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className='h-screen flex bg-gradient-to-b from-purple-500 to-slate-400 items-center justify-center'>
      <div className='text-center bg-white bg-opacity-70 p-10 rounded-lg shadow-lg'>
        <h1 className='font-inter underline text-3xl md:text-3xl lg:text-4xl mb-6 text-purple-700'>
          Welcome to Brand Product Manager
        </h1>
        <p className='text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-gray-700'>
          Easily manage and organize your brands and products with our powerful CRUD platform. 
          <br />
          Create, update, and delete brands and products with just a few clicks.
        </p>
        <div className='flex justify-center space-x-8'>
          <Link
            to="/login"
            className='bg-transparent border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 hover:text-white transition duration-300'
          >
            Login
          </Link>
          <Link
            to="/signup"
            className='bg-transparent border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 hover:text-white transition duration-300'
          >
            Signup
          </Link>
        </div>
      </div>
      <div className='absolute bottom-4 text-black text-sm'>
        <p>© {new Date().getFullYear()} Sameena Zubair. All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default Home;
