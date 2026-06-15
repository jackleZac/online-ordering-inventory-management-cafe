import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

declare global {
  interface ImportMeta {
    env: {
      VITE_SERVER_URL: string;
    };
  }
}

function CreateSupplier() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${SERVER_URL}/api/admin/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          phoneNumber,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create supplier");
      }

      setSuccessMessage("Supplier created successfully");

      setTimeout(() => {
        navigate("/admin/suppliers");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
          <a className="font-medium" href="/admin/suppliers">
            ← Back
          </a>

          <h1 className="text-2xl font-bold text-gray-800 mt-12 mb-6">
            Create Supplier
          </h1>

          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Supplier Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter supplier name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>

              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter supplier email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="text-white px-5 py-3 rounded-lg bg-[#6F4E37] hover:bg-[#5c3f2d] transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Supplier"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/suppliers")}
                className="border border-gray-300 px-5 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
      </div>
    </AdminLayout>
  );
}

export default CreateSupplier;