import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  totalItemsSupplied: number;
};

function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${SERVER_URL}/api/admin/suppliers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch suppliers");
        }

        const data = await response.json();

        setSuppliers(data.suppliers);

      } catch (err) {
        console.error(err);
        setError("Failed to load suppliers.");
      } finally {
        setLoading(false);
      }
    }

    fetchSuppliers();
  }, []);

  // Redirect to EditSupplier
  async function handleEdit(id: string) {
    navigate(`/admin/suppliers/edit/${id}`)
  };

  // Delete supplier
  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${SERVER_URL}/api/admin/suppliers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete supplier");
      }

      // Remove deleted supplier from UI
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter(
          (supplier) => supplier._id !== id
        )
      );

    } catch (error) {
      console.error(error);
      alert("Failed to delete supplier.");
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-gray-600">
            Loading suppliers...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Suppliers
        </h1>
        <div className="flex flex-row-reverse">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 my-6 rounded"
          >
            Add
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">
                  Supplier Name
                </th>

                <th className="border px-4 py-2">
                  Phone Number
                </th>

                <th className="border px-4 py-2">
                  Email
                </th>

                <th className="border px-4 py-2">
                  Total Items Supplied
                </th>

                <th className="border px-4 py-2">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr
                    key={supplier._id}
                    className="text-center"
                  >
                    <td className="border px-4 py-2">
                      {supplier.name}
                    </td>

                    <td className="border px-4 py-2">
                      {supplier.phoneNumber}
                    </td>

                    <td className="border px-4 py-2">
                      {supplier.email || "N/A"}
                    </td>

                    <td className="border px-4 py-2">
                      {supplier.totalItemsSupplied}
                    </td>

                    <td className="border px-4 py-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(supplier._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(supplier._id)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border px-4 py-4 text-center text-gray-500"
                  >
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Suppliers;