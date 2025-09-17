import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ❌ ToastContainer hata diya
import "./Home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Auth state check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Logout function
  const logoutUser = async () => {
    try {
      await signOut(auth);
      toast.success(" Logged out successfully!");

      // Toast khatam hone ke baad navigate
      setTimeout(() => {
        navigate("/");
      }, 3100);
    } catch (err) {
      console.error(err);
      toast.error("❌ Logout failed: " + err.message);
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h2>
          Welcome to <span className="brand">SetuMind</span> 🎉
        </h2>
        {user && (
          <p className="user-info">
            <strong>User ID:</strong> {user.uid}
          </p>
        )}
        <button onClick={logoutUser} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
