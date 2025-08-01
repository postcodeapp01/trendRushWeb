"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export interface FieldConfig {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "number" | "select" | "checkbox" | "date";
  required?: boolean;
  options?: { label: string; value: string }[];
  colSpan?: number;
  isNumber?: boolean; // ✅ new prop
  isText?: boolean;   // ✅ optional: restrict to letters
}

interface GenericFormProps {
  title?: string;
  fields: FieldConfig[];
  formData: Record<string, any>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => void;
  onGenerateCode?: () => void;
  showBackButton?: boolean;
  gridCols?: number;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  errors?: Record<string, string>; // <-- ADD THIS
}


export default function GenericForm({
  title,
  fields,
  formData,
  setFormData,
  onSubmit,
  onGenerateCode,
  showBackButton,
  gridCols = 2,
  showSaveButton = true,
  showCancelButton = true,
  errors = {},
}: GenericFormProps) {
  const router = useRouter();

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value, type, checked }: any = e.target;

  const field = fields.find((f) => f.name === name);

  // Restrict digits if isText is true
  if (field?.isText && /\d/.test(value)) {
    return;
  }

  // Restrict non-digits if isNumber is true
  if (field?.isNumber && /\D/.test(value)) {
    return;
  }

  setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
};



  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        {showBackButton && (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-300 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-${gridCols} gap-4`}>
        {fields.map((field) => {
          const span = field.colSpan || 1;
          return (
            <div
              key={field.name}
              className={`sm:col-span-${span} col-span-1`}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "select" ? (
                <div className="space-y-1">
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className={`w-full bg-white border ${errors[field.name] ? "border-red-500" : "border-gray-300"
                      } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${errors[field.name] ? "focus:ring-red-500" : "focus:ring-purple-500"
                      } shadow-sm transition`}
                  >
                    <option value="" disabled hidden>
                      {field.placeholder || "Select an option"}
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {errors[field.name] && (
                    <p className="text-sm text-red-600 mt-1">{errors[field.name]}</p>
                  )}
                </div>

              ) : field.type === "checkbox" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={formData[field.name] || false}
                    onChange={handleChange}
                    className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor={field.name} className="text-sm font-semibold text-gray-700">
                    {field.placeholder}
                  </label>
                </div>
              ) : (
                <div className="space-y-1">
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (field.isNumber && /[^0-9]/.test(e.key)) {
                        e.preventDefault(); // blocks non-digits
                      }
                      if (field.isText && /[0-9]/.test(e.key)) {
                        e.preventDefault(); // blocks digits
                      }
                    }}
                    placeholder={field.placeholder}
                    className={`w-full bg-white border ${errors[field.name] ? "border-red-500" : "border-gray-300"
                      } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${errors[field.name] ? "focus:ring-red-500" : "focus:ring-purple-500"
                      } shadow-sm placeholder-gray-400 transition`}
                  />
                  {errors[field.name] && (
                    <p className="text-sm text-red-600 mt-1">{errors[field.name]}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {onGenerateCode && (
        <div>
          <button
            type="button"
            onClick={onGenerateCode}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            Generate Code
          </button>
        </div>
      )}

      {(showCancelButton || showSaveButton) && (
        <div className="flex justify-between pt-6">
          {showCancelButton ? (
            <button
              type="button"
              className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          ) : <div />}

          {showSaveButton && (
            <button
              type="submit"
              className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
            >
              Save
            </button>
          )}
        </div>
      )}
    </form>
  );
}
