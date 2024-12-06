import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { collection, onSnapshot, deleteDoc, doc, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Dashboard = () => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("brands");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const navigate = useNavigate();

  // Check user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, []);

  // Fetch brands and products from Firestore only if the user is authenticated
  useEffect(() => {
    if (!user) {
      console.warn("User is not authenticated.");
      return;
    }

    console.log("User:", user);

    // Query brands and products where userId matches the logged-in user's uid
    const fetchData = async () => {
      try {
        const brandsQuery = query(
          collection(db, "brands"),
          where("userId", "==", user.uid)
        );
        const productsQuery = query(
          collection(db, "products"),
          where("userId", "==", user.uid)
        );

        // Listen for real-time updates for brands
        const unsubscribeBrands = onSnapshot(brandsQuery, (snapshot) => {
          setBrands(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        });

        // Listen for real-time updates for products
        const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
          setProducts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        });

        // Cleanup subscriptions on unmount
        return () => {
          unsubscribeBrands();
          unsubscribeProducts();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      navigate("/"); // Redirect to the homepage after signing out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Filter brands or products based on view mode and search query
  const filteredItems =
    viewMode === "brands"
      ? brands.filter((brand) =>
          brand.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            product.brandId === selectedBrand?.id
        );
        // Function to delete a brand by its ID
        const handleDeleteBrand = async (brandId) => {
          try {
            const brandRef = doc(db, "brands", brandId);
            await deleteDoc(brandRef);
            alert("Brand deleted successfully!");
          } catch (error) {
            console.error("Error deleting brand:", error);  // Log the error
            alert("Failed to delete brand. Please try again.");
          }
        };
        
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-20 lg:z-auto transform lg:transform-none transition-transform duration-300 w-64 bg-gradient-to-b from-gray-800 to-slate-600 text-white p-4 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button on small screen */}
        <button
          className="lg:hidden text-white absolute top-4 right-4"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        {user && (
          <div className="relative mb-4">
            <div
              onClick={() => setProfileMenuVisible(!profileMenuVisible)}
              className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-700 font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {profileMenuVisible && (
              <div className="absolute top-14 left-0 w-48 bg-white shadow-lg rounded-lg p-4">
                <p className="font-semibold">{user.email}</p>
                <Link to="/login" className="text-blue-500 hover:underline">
                  Switch Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="mt-2 text-red-500 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search Input */}
        <input
          type="text"
          placeholder={`Search ${viewMode === "brands" ? "Brands" : "Products"}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
        />

        <button
          onClick={() => {
            setViewMode("brands");
            setSelectedBrand(null);
            setSearchQuery(""); // Clear search query when switching views
          }}
          className={`w-full text-left p-2 ${
            viewMode === "brands" ? "bg-gray-700" : ""
          }`}
        >
          View Brands
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 bg-gradient-to-b from-purple-500 via bg-purple-700 to-slate-400">
        {viewMode === "brands" && (
          <>
            <h2 className="text-2xl pt-8 mt-5 font-bold text-gray-900 font-serif uppercase mb-4">Brands</h2>
            {filteredItems.length > 0 ? (
              filteredItems.map((brand) => (
                <div
                  key={brand.id}
                  className="p-4 border rounded mb-2 bg-purple-200 shadow-lg"
                >
                  <h3 className="font-bold text-xl uppercase text-green-900">
                    {brand.name}
                  </h3>
                  <p className="mt-2 text-balance">{brand.description}</p>
                  <div className="mt-4 space-x-5 space-y-3">
                    <button
                      onClick={() => {
                        setViewMode("products");
                        setSelectedBrand(brand);
                      }}
                      className="bg-purple-500 hover:bg-purple-600 duration-200 w-60 text-black px-4 py-2 rounded"
                    >
                      View Products
                    </button>
                    <Link
                      to={`/dashboard/edit-brand/${brand.id}`}
                      className="bg-blue-400 hover:bg-blue-500 duration-200 text-black px-4 py-2 rounded"
                    >
                      Edit
                    </Link>
                    <button
                    onClick={() => handleDeleteBrand(brand.id)}  // Pass the brand's ID to the delete handler
                    className="bg-red-600 hover:bg-red-700 duration-200 text-white px-4 py-2 rounded"
                    >
                  Delete
               </button>

                  </div>
                </div>
              ))
            ) : (
              <p>No brands found. Add some to get started!</p>
            )}
          </>
        )}

        {viewMode === "products" && selectedBrand && (
          <>
            <button
              onClick={() => {
                setViewMode("brands");
                setSelectedBrand(null);
              }}
              className="bg-blue-500 hover:bg-blue-600  duration-200 mb-8 text-white px-4 mt-8 py-2 rounded"
            >
              Back to Brands
            </button>

            <h2 className="text-2xl font-bold  text-gray-900 font-serif uppercase mb-4">
              {selectedBrand.name} Products
            </h2>
            {filteredItems.length > 0 ? (
              filteredItems.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border rounded mb-2 bg-purple-200 shadow-lg"
                >
                  <h3 className="font-bold text-xl uppercase text-green-900 ">
                    {product.name}
                  </h3>
                  <p className="mt-2"> <span className="font-bold">Description</span>-{product.description}</p>
                  <p className="font-bold mt-5 ">$ {product.price}</p>
                </div>
              ))
            ) : (
              <p>No products found for this brand. Add some to get started!</p>
            )}
          </>
        )}
      </div>
    {/* Floating Buttons */}
    {viewMode === "brands" && !selectedBrand && (
        <Link
          to="/dashboard/add-brand"
          className="fixed bottom-5 right-5 bg-gray-600 text-white p-4 rounded-full shadow-lg"
        >
          + Add Brand
        </Link>
      )}

      {viewMode === "products" && selectedBrand && (
        <button
          onClick={() =>
            navigate(`/dashboard/add-product?brandId=${selectedBrand.id}`)
          }
          className="fixed bottom-5 right-5 bg-gray-600 text-white p-4 rounded-full shadow-lg"
        >
          + Add Product
        </button>
      )}

      {/* Hamburger Menu */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 p-2 bg-gray-800 text-white rounded-full"
      >
        ☰
      </button>
    </div>
  );
};

export default Dashboard;
