import React, { useEffect, useRef, useState } from "react";
import "./LandingPage.css";
import assets from "../../src/assets/assets";
import { auth } from "../../config/firebase";
import { signInAnonymously, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const loginOverlayRef = useRef(null);
  const [typingText, setTypingText] = useState("");
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Anonymous Login

  // Logout
  const logoutUser = async () => {
    try {
      await signOut(auth);
      alert("Logged out!");
      navigate("/"); // ✅ Logout ke baad landing page pe redirect
    } catch (err) {
      console.error(err);
      alert("❌ Logout failed: " + err.message);
    }
  };

  const welcomeText =
    "You are not alone. Every day thousands of students struggle with stress, loneliness and depression. सेतुMind is your companion - where you can share your feelings without any judgment. Here you will be understood, supported and most importantly - you will feel that you are truly not alone. Your mental health is our priority. 💚";

  // Emergency help
  const showEmergencyHelp = () => {
    alert(
      "🚨 Emergency Mental Health Resources:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• SAMHSA Helpline: 1-800-662-4357\n\nIf you're in immediate danger, please call 911 or go to your nearest emergency room."
    );
  };

  // Mood check
  const showMoodCheck = () => {
    const moods = [
      "😢 Very Sad",
      "😟 Sad",
      "😐 Neutral",
      "🙂 Good",
      "😊 Great",
    ];
    const selected = prompt(
      "How are you feeling today?\n\n1. 😢 Very Sad\n2. 😟 Sad\n3. 😐 Neutral\n4. 🙂 Good\n5. 😊 Great\n\nEnter a number (1-5):"
    );
    if (selected && selected >= 1 && selected <= 5) {
      alert(
        `Thanks for sharing! You selected: ${
          moods[selected - 1]
        }\n\nRemember: It's okay to feel whatever you're feeling. SetuMind is here to support you.`
      );
    }
  };

  // Meditation
  const startMeditation = () => {
    const duration = prompt(
      "Choose meditation duration:\n\n1. 1 minute\n2. 3 minutes\n3. 5 minutes\n\nEnter a number (1-3):"
    );

    if (duration && duration >= 1 && duration <= 3) {
      const minutes = [1, 3, 5][duration - 1];
      let seconds = minutes * 60;

      alert(
        `🧘‍♀️ Starting ${minutes}-minute meditation...\n\nFind a comfortable position, close your eyes, and focus on breathing.`
      );

      // countdown timer
      const timer = setInterval(() => {
        seconds--;
        console.log(`Time left: ${Math.floor(seconds / 60)}m ${seconds % 60}s`);

        if (seconds <= 0) {
          clearInterval(timer);
          // play buzzer
          alert("🌟 Meditation complete! Great job!");
        }
      }, 1000);
    } else {
      alert("❌ Invalid choice. Please enter 1, 2, or 3.");
    }
  };

  // Login Overlay
  const showLoginCard = () => {
    loginOverlayRef.current.classList.add("visible");
    document.body.style.overflow = "hidden";
  };
  const closeLoginCard = () => {
    loginOverlayRef.current.classList.remove("visible");
    document.body.style.overflow = "auto";
  };

  // Continue anonymously
  const continueAnonymously = async (e) => {
    const btn = e.currentTarget;
    const originalContent = btn.innerHTML;

    btn.innerHTML =
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg>Entering Safely...';
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.8";

    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user; // Firebase ka user object
      alert(`✅ Logged in Anonymously!\nUser ID: ${user.uid}`);
      console.log("Logged in user:", user);
      if (user) {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Login failed: " + err.message);
    } finally {
      btn.innerHTML = originalContent;
      btn.style.pointerEvents = "all";
      btn.style.opacity = "1";
    }
  };

  const showLogin = () => {
    alert(
      "📧 Login/Signup form would appear here. This feature allows you to save your progress and keep your sessions private."
    );
  };

  // Typing animation
  useEffect(() => {
    if (welcomeIndex < welcomeText.length) {
      const timeout = setTimeout(() => {
        setTypingText(welcomeText.slice(0, welcomeIndex + 1));
        setWelcomeIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setShowCursor(false), 1000);
    }
  }, [welcomeIndex]);

  // Escape key close
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && closeLoginCard();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Parallax floating effect
  useEffect(() => {
    const handler = (e) => {
      const elements = document.querySelectorAll(".floating-element");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      elements.forEach((el, index) => {
        const speed = (index + 1) * 0.3;
        const xPos = (x - 0.5) * speed * 30;
        const yPos = (y - 0.5) * speed * 30;
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div>
      <div className="overlay"></div>
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      {/* ✅ Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          {/* <span className="logo">💚</span>
          <h1 className="brand-name">SetuMind</h1> */}
          <img src={assets.logo} alt="SetuMind Logo" className="logo-img" />
        </div>
        <div className="nav-right">
          <button className="emergency-btn" onClick={showEmergencyHelp}>
            Need Help?
          </button>
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div
          className="quick-action-btn"
          onClick={showMoodCheck}
          title="Quick Mood Check"
        >
          <span className="mood-emoji">😊</span>
        </div>
        <div
          className="quick-action-btn"
          onClick={startMeditation}
          title="Mini Meditation"
        >
          ✔
        </div>
      </div>

      {/* Main Container */}
      <div className="container">
        <div className="header-section">
          <h2 className="main-heading">
            Welcome to <span class="setu">सेतुMind</span>
          </h2>
          <p className="welcome-paragraph">
            {typingText}
            {showCursor && <span className="typing-cursor">|</span>}
          </p>
        </div>

        <div className="get-started-section">
          <button className="get-started-btn" onClick={showLoginCard}>
            Get Started
          </button>
        </div>

        <div className="trust-indicators">
          <div className="trust-item">🔒 100% Confidential</div>
          <div className="trust-item">✅ Professional Support</div>
          <div className="trust-item">⭐ 24/7 Available</div>
        </div>
      </div>

      {/* Login Overlay */}
      <div
        className="login-overlay"
        ref={loginOverlayRef}
        onClick={closeLoginCard}
      >
        <div className="login-card" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={closeLoginCard}>
            ❌
          </button>
          <h3 className="card-title">Welcome to SetuMind</h3>
          <p className="card-subtitle">
            Choose how you'd like to begin your mental health journey with us
          </p>
          <button
            className="option-btn anonymous-btn"
            onClick={continueAnonymously}
          >
            Continue Anonymously
          </button>
          {/* <button className="option-btn login-btn" onClick={showLogin}>
            Login / Signup
          </button> */}
          <div className="privacy-note">
            <p>
              <strong>🔒 Your Privacy is Our Priority:</strong> Anonymous access
              requires no personal information. End-to-end encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
