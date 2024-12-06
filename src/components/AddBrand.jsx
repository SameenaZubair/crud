import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig"; // Import auth to get the logged-in user
import { useNavigate } from "react-router-dom";

const AddBrand = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brandLogo, setBrandLogo] = useState(""); // Optional field
  const [error, setError] = useState(null); // Track errors
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    setError(null); // Reset any previous errors

    try {
      const userId = auth.currentUser?.uid; // Get the current user's UID
      if (!userId) throw new Error("User not authenticated!"); // Handle unauthenticated users

      // Add the brand to Firestore with userId
      await addDoc(collection(db, "brands"), {
        name,
        description: description || "", // Default to an empty string if not provided
        brandLogo: brandLogo || "", // Default to an empty string if not provided
        userId: auth.currentUser?.uid, // Attach the userId for Firestore rules
        
      });

      alert("Brand added successfully!");
      navigate("/dashboard"); // Navigate to the dashboard
    } catch (error) {
      console.error("Error adding brand:", error);
      setError("Failed to add brand. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="p-4 bg-gradient-to-b from-purple-400 to-slate-400 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-3 pt-8">Add Brand</h2>
      <form onSubmit={handleSubmit} className="space-y-4 h-screen pt-8">
        <input
          type="text"
          placeholder="Brand Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required // This is still required
        />
        <textarea
          placeholder="Brand Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={brandLogo}
          placeholder="Logo URL (Optional)"
          onChange={(e) => setBrandLogo(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="p-2 bg-gray-700 text-white rounded"
          disabled={loading} // Disable the button when loading
        >
          {loading ? "Adding..." : "Add Brand"}
        </button>
      </form>
    </div>
  );
};

export default AddBrand;
