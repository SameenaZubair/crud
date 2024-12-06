
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brandId, setBrandId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract brandId from URL
    const params = new URLSearchParams(location.search);
    const brandIdFromUrl = params.get("brandId");
    if (brandIdFromUrl) setBrandId(brandIdFromUrl);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = auth.currentUser?.uid; // Get current user's UID
      if (!userId) throw new Error("User not authenticated!");
  
      await addDoc(collection(db, "products"), {
        name,
        description,
        price: parseFloat(price),
        brandId,
        userId: auth.currentUser?.uid,// Attach userId to the document
      });
      alert("Product added successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };
  

  return (
    <div className="p-4 bg-gradient-to-b h-screen from-purple-400 to-slate-400 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-3 mt-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mt-8 pt-5">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
