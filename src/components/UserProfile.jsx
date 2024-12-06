import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig'; // assuming Firebase is initialized in this file
import { signOut } from 'firebase/auth';

const UserProfile = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Logout user function
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login after sign out
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  // Toggle dropdown menu for email and switch account
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="relative ml-auto"> {/* Align to right using ml-auto */}
      {/* Profile Circle */}
      <div
        onClick={toggleDropdown}
        className="w-12 h-12 rounded-full bg-gray-500 pb-5 text-white text-xl cursor-pointer"
      >
        {user ? user.displayName?.charAt(0) || 'U' : 'U'} {/* Initials or fallback */}
      </div>

      {/* Dropdown with email and switch account option */}
      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4">
          <p className="text-sm text-gray-600">Email: {user.email}</p>
          <button
            onClick={handleSignOut}
            className="text-blue-500 hover:text-blue-700 mt-2 block"
          >
            Switch Account
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
