import axios from "axios";
import React, { useState } from "react";

const CompleteProfile: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem("accessToken") || ""; // from Login or 206 token
      const res = await axios.post(
        "http://localhost:3000/user/auth/complete-profile",
        { name, phone, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Store final tokens
      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);

      alert("Profile completed successfully!");
      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.response?.data?.message || "Error completing profile");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-80"
      />
      <input
        type="text"
        placeholder="Phone (+911234567890)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 mb-2 w-80"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-80"
      />

      <button
        onClick={handleComplete}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default CompleteProfile;
