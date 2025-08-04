"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [needsProfile, setNeedsProfile] = useState(false);
  const [name, setName] = useState("");
  const [extraPhone, setExtraPhone] = useState("");
  const router = useRouter();

  const handleSendOtp = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/auth/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || null, phone: phone || null }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        alert("OTP sent successfully");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || null,
          phone: phone || null,
          code: otp,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.statusCode === 200) {
          // ✅ User exists → go home
          router.push("/home");
        } else if (data.statusCode === 206) {
          // ✅ New user → needs name & phone
          setNeedsProfile(true);
        }
      } else {
        alert(data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleCompleteProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: extraPhone,
          name,
          code: otp, // reuse same OTP
        }),
      });

      const data = await response.json();
      if (response.ok && data.statusCode === 200) {
        router.push("/home");
      } else {
        alert(data.message || "Failed to complete profile");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!otpSent ? (
        // Step 1: Email/Phone input
        <div className="bg-white shadow-lg rounded-lg p-8 w-96">
          <h2 className="text-2xl font-bold mb-4">Signup / Login</h2>
          <input
            type="email"
            placeholder="Email (or leave empty if using phone)"
            className="border p-2 w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone (or leave empty if using email)"
            className="border p-2 w-full mb-3"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            onClick={handleSendOtp}
            className="bg-blue-500 text-white py-2 px-4 rounded w-full"
          >
            Send OTP
          </button>
        </div>
      ) : !needsProfile ? (
        // Step 2: OTP input
        <div className="bg-white shadow-lg rounded-lg p-8 w-96">
          <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
          <input
            type="text"
            placeholder="OTP"
            className="border p-2 w-full mb-3"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-green-500 text-white py-2 px-4 rounded w-full"
          >
            Verify
          </button>
        </div>
      ) : (
        // Step 3: Complete profile
        <div className="bg-white shadow-lg rounded-lg p-8 w-96">
          <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 w-full mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            className="border p-2 w-full mb-3"
            value={extraPhone}
            onChange={(e) => setExtraPhone(e.target.value)}
          />
          <button
            onClick={handleCompleteProfile}
            className="bg-blue-600 text-white py-2 px-4 rounded w-full"
          >
            Save & Continue
          </button>
        </div>
      )}
    </div>
  );
}
