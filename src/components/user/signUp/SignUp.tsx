"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GenericForm, { FieldConfig } from "@/components/generic/GenericForm";
import { apiUrls } from "@/utils/Api";

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const fields: FieldConfig[] = [
    {
      name: "username",
      label: "Username",
      placeholder: "Enter your username",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "text",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "text",
      required: true,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm your password",
      type: "text",
      required: true,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrls.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrors({ email: errorData.message || "Registration failed" });
        return;
      }

      setSuccess("Registration Successful! Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setErrors({ email: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Trend<span className="text-purple-600">Rush</span>.
          </h1>
          <p className="text-sm text-gray-500 mt-1">Create your account</p>
        </div>

        {/* Form */}
        <GenericForm
          title=""
          fields={fields}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          showBackButton={false}
          showSaveButton={!loading}
          showCancelButton={false}
          gridCols={1}
          errors={errors}
        />

        {/* Login Link */}
        <button
          onClick={() => router.push("/login")}
          className="mt-6 w-full text-sm text-center text-gray-600 hover:text-purple-600 transition"
        >
          Already have an account? <span className="font-medium underline">Login</span>
        </button>

        {/* Status Messages */}
        {loading && (
          <p className="text-center text-purple-600 text-sm mt-4">Registering...</p>
        )}
        {success && (
          <p className="text-center text-green-600 text-sm mt-4">{success}</p>
        )}
      </div>
    </div>
  );
}
