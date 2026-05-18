import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";

declare global {
  interface ImportMeta {
    env: {
      VITE_SERVER_URL: string;
    };
  }
}

type Supplier = {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
};

function EditSupplier() {

  const { id } = useParams();

  const navigate = useNavigate();

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {

    async function fetchSupplier() {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${SERVER_URL}/api/admin/suppliers/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch supplier");
        }

        const data = await response.json();

        const supplier: Supplier = data.supplier;

        setName(supplier.name);
        setPhoneNumber(supplier.phoneNumber);
        setEmail(supplier.email ?? "");

      } catch (error) {

        console.error(error);
        alert("Failed to load supplier.");

      } finally {

        setLoading(false);

      }
    }

    fetchSupplier();

  }, [id]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${SERVER_URL}/api/admin/suppliers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            phoneNumber,
            email
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update supplier");
      }

      alert("Supplier updated successfully.");

      navigate("/admin/suppliers");

    } catch (error) {

      console.error(error);
      alert("Failed to update supplier.");

    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p>Loading supplier...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="p-6 max-w-xl">

        <h1 className="text-2xl font-bold mb-6">
          Edit Supplier
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Supplier Name */}
          <div>
            <label className="block mb-1 font-medium">
              Supplier Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              className="
                w-full
                border
                rounded-lg
                px-4
                py-2
              "
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value)
              }
              required
              className="
                w-full
                border
                rounded-lg
                px-4
                py-2
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full
                border
                rounded-lg
                px-4
                py-2
              "
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              bg-[#6F4E37]
              hover:bg-[#5c3f2d]
              text-white
              px-6
              py-2
              rounded-lg
            "
          >
            Update Supplier
          </button>

        </form>

      </div>

    </AdminLayout>
  );
}

export default EditSupplier;