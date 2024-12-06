import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import LogIn from './pages/login'
import SignUp from './pages/signup';
import Dashboard from './pages/Dashboard'
import Home from './components/Home';
import AddBrand from './components/AddBrand';
import AddProduct from './components/AddProduct';
import EditBrand from './components/EditBrand';
import EditProduct from './components/EditProduct';
import UserProfile from './components/UserProfile';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<UserProfile />} />
        <Route path="/dashboard/add-brand" element={<AddBrand />} />
        <Route path="/dashboard/add-product" element={<AddProduct />} />
        <Route path="/dashboard/edit-brand/:id" element={<EditBrand />} />
        <Route path="/dashboard/edit-product/:id" element={<EditProduct />} /> 

      </>
    )
  );
  
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
