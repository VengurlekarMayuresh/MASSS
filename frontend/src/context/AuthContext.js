import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, [token]);

  // ---------- REGISTER ----------
  const register = async (formData) => {
    try {
      // Map UI fields -> backend schema
      const nameParts = (formData.name || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const userPayload = {
        email: formData.email,
        password: formData.password,
        role: formData.role || "patient",
        firstName,
        lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: {
          street: formData.address,
          city: formData.city,
          pincode: formData.zipCode,
          state: "Maharashtra",
          area: "",
        },
      };

      // 1) Register in Mongo backend
      const res = await fetch("http://localhost:5002/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.message || "Failed to register user");
      }

      // 2) Create Firebase Auth user
      const fbUser = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 3) Save profile in Firestore (WITHOUT password)
      const { password, ...safeProfile } = userPayload;
      await setDoc(doc(db, "users", fbUser.user.uid), {
        ...safeProfile,
        firebaseUid: fbUser.user.uid,
        createdAt: new Date(),
      });

      // 4) Persist session from backend response
      const { token: jwtToken, user } = payload;
      if (!jwtToken || !user) {
        throw new Error("Registration succeeded but session payload missing");
      }

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(user));

      setCurrentUser(user);
      setToken(jwtToken);

      return { success: true, user };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: error.message || "Registration error" };
    }
  };

  // ---------- LOGIN ----------
  const login = async (email, password) => {
    try {
      // 1) Login via Mongo
      const res = await fetch("http://localhost:5002/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.message || "Invalid credentials");

      // 2) Verify Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // 3) Persist
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));

      setCurrentUser(payload.user);
      setToken(payload.token);

      return { success: true, user: payload.user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    }
  };

  // ---------- LOGOUT ----------
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCurrentUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

    const updateProfile = async (updateData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const res = await fetch("http://localhost:5002/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.message || "Failed to update profile.");
      }

      // Update the user in localStorage and state
      localStorage.setItem("user", JSON.stringify(payload.user));
      setCurrentUser(payload.user); // This will cause your UI to re-render with new data

      return { success: true, user: payload.user, message: payload.message };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, message: error.message };
    }
  };

  const value = {
    currentUser,
    token,
    loading,       // <-- now exposed
    register,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
