"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import "../../../styles/globals.css";

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"login" | "otp" | "profile">("login");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Profile OTP states
  const [profileOtp, setProfileOtp] = useState(["", "", "", "", "", ""]);
  const profileOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [profileOtpSent, setProfileOtpSent] = useState(false);
  const [isProfileOtpVerified, setIsProfileOtpVerified] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      router.push("/home");
    }
  }, [router]);

  // First OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const payload = loginMethod === "phone" ? { phone } : { email };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/auth/initiate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setStep("otp");
        if (data.data?.isNewUser) {
          localStorage.setItem("isNewUser", "true");
        } else {
          localStorage.removeItem("isNewUser");
        }
      } else {
        setError(data.message);
      }
    } catch {
      setError("Something went wrong.");
    }
  };

  const handleVerifyOtp = async () => {
    const formattedPhone =
      loginMethod === "phone" && !phone.startsWith("+91")
        ? `+91${phone}`
        : phone;

    const payload =
      loginMethod === "phone"
        ? { phone: formattedPhone, code: otp.join("") }
        : { email, code: otp.join("") };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/auth/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (res.status === 200) {
      localStorage.setItem("accessToken", data.data.accessToken);
      router.push("/home");
    } else if (res.status === 206) {
      localStorage.setItem("tempToken", data.data.accessToken);
      setStep("profile");
    } else {
      alert(data.message || "Invalid OTP");
    }
  };

  // Profile OTP Sending
  const handleSendProfileOtp = async () => {
    try {
      const payload =
        loginMethod === "phone"
          ? { email: profileEmail }
          : { phone: profilePhone };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/auth/initiate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setProfileOtpSent(true);
        alert("OTP sent successfully.");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch {
      alert("Something went wrong while sending OTP.");
    }
  };

  // Profile OTP Verification
  const handleVerifyProfileOtp = async () => {
    try {
      const payload =
        loginMethod === "phone"
          ? { email: profileEmail, code: profileOtp.join("") }
          : { phone: profilePhone, code: profileOtp.join("") };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/auth/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Verified successfully.");
        setProfileOtpSent(false);
        setIsProfileOtpVerified(true);
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch {
      alert("Something went wrong while verifying OTP.");
    }
  };

  const handleCompleteProfile = async () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    if (!isProfileOtpVerified) {
      alert("Please verify OTP first.");
      return;
    }

    try {
      const token =
        localStorage.getItem("tempToken") ||
        localStorage.getItem("accessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/auth/complete-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            phone: loginMethod === "email" ? profilePhone : phone,
            email: loginMethod === "phone" ? profileEmail : email,
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.statusCode === 200) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        localStorage.removeItem("tempToken");
        router.push("/home");
      } else {
        alert(data.message || "Failed to complete profile");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full font-sans">
      {/* Left banner */}
      <div className="relative flex-1 flex justify-center items-center bg-gradient-to-br from-[#FF6A6A] to-[#FF5757] p-8">
        <div className="text-center text-white">
          <img
            src="/images/img1.png"
            alt="TrendRush Banner"
            className="drop-shadow-2xl w-[20rem] lg:w-[28rem] mb-6"
          />
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Discover New Trends
          </h1>
          <p className="text-md lg:text-lg text-red-100">
            Log in to continue your journey with TrendRush.
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
          <div className="flex justify-center items-center mb-4">
            <Image
              src="/images/TrendRush.png"
              alt="TrendRush Logo"
              width={150}
              height={50}
            />
          </div>

          {/* Login Step */}
          {step === "login" && (
            <>
              <h2 className="text-center text-2xl font-bold mb-2">
                Welcome Back!
              </h2>
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setLoginMethod("phone")}
                  className={`px-4 py-2 border rounded-l ${
                    loginMethod === "phone" ? "bg-red-500 text-white" : ""
                  }`}
                >
                  Phone
                </button>
                <button
                  onClick={() => setLoginMethod("email")}
                  className={`px-4 py-2 border rounded-r ${
                    loginMethod === "email" ? "bg-red-500 text-white" : ""
                  }`}
                >
                  Email
                </button>
              </div>
              <form onSubmit={handleSendOtp}>
                {loginMethod === "phone" ? (
                  <div className="relative mb-4">
                    <FaPhoneAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Enter Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border rounded-lg px-12 py-3"
                    />
                  </div>
                ) : (
                  <div className="relative mb-4">
                    <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border rounded-lg px-12 py-3"
                    />
                  </div>
                )}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-[#ff5757] text-white py-3 rounded-lg"
                >
                  Continue
                </button>
              </form>
            </>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <>
              <button
                onClick={() => setStep("login")}
                className="text-sm text-blue-500 mb-2"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[i] = e.target.value;
                      setOtp(newOtp);
                      if (e.target.value && i < otp.length - 1)
                        otpRefs.current[i + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        otpRefs.current[i - 1]?.focus();
                      }
                    }}
                    className="w-12 h-12 text-center border rounded-lg text-xl font-semibold"
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-[#ff5757] text-white py-3 rounded-lg"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Profile Step */}
          {step === "profile" && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-center">
                Complete Profile
              </h2>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 mb-3 rounded-lg"
              />
              {loginMethod === "phone" && (
                <>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={profileEmail}
                    onChange={(e) => {
                      setProfileEmail(e.target.value);
                      setIsProfileOtpVerified(false);
                    }}
                    className="w-full border p-2 mb-3 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleSendProfileOtp}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg mb-3"
                  >
                    Send Email OTP
                  </button>
                </>
              )}
              {loginMethod === "email" && (
                <>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={profilePhone}
                    onChange={(e) => {
                      setProfilePhone(e.target.value);
                      setIsProfileOtpVerified(false);
                    }}
                    className="w-full border p-2 mb-3 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleSendProfileOtp}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg mb-3"
                  >
                    Send Phone OTP
                  </button>
                </>
              )}

              {profileOtpSent && (
                <div className="flex flex-col items-center mb-3">
                  <div className="flex justify-center gap-3 mb-3">
                    {profileOtp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (profileOtpRefs.current[i] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const newOtp = [...profileOtp];
                          newOtp[i] = e.target.value;
                          setProfileOtp(newOtp);
                          if (e.target.value && i < profileOtp.length - 1)
                            profileOtpRefs.current[i + 1]?.focus();
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            !profileOtp[i] &&
                            i > 0
                          ) {
                            profileOtpRefs.current[i - 1]?.focus();
                          }
                        }}
                        className="w-12 h-12 text-center border rounded-lg text-xl font-semibold"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyProfileOtp}
                    className="w-full bg-green-500 text-white py-2 rounded-lg"
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              <button
                onClick={handleCompleteProfile}
                disabled={!isProfileOtpVerified}
                className={`w-full py-3 rounded-lg ${
                  isProfileOtpVerified
                    ? "bg-[#ff5757] text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Save & Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
