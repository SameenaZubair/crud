import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brandLogo, setBrandLogo] = useState("");

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const brandDoc = await getDoc(doc(db, "brands", id));
        if (brandDoc.exists()) {
          const data = brandDoc.data();
          setName(data.name);
          setDescription(data.description);
          setBrandLogo(data.brandLogo || "");
        } else {
          console.error("No such brand found!");
        }
      } catch (error) {
        console.error("Error fetching brand:", error);
      }
    };
    fetchBrand();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const brandDoc = doc(db, "brands", id);
      await updateDoc(brandDoc, { name, description, brandLogo });
      alert("Brand updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating brand:", error);
      alert("Failed to update the brand. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-gradient-to-b from-purple-400 to-slate-400 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-3 pt-8">Edit Brand</h2>
      <form onSubmit={handleSubmit} className="space-y-4 h-screen pt-8">
        <input
          type="text"
          placeholder="Brand Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
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
          placeholder="Logo URL"
          onChange={(e) => setBrandLogo(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-gray-700 text-white rounded">
          Update Brand
        </button>
      </form>
    </div>
  );
};

export default EditBrand;
