import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";

declare global {
  interface ImportMeta {
    env: {
      VITE_SERVER_URL: string;
    };
  }
}

type Supplier = {
  name: string;
}

type Item = {
  name: string;
  supplier: Supplier;
};

type Batch = {
  _id: string;
  item: Item;
  batchNumber?: string;
  initialQuantity: number;
  currentQuantity: number;
  expiryDate?: Date;
  receivedDate: Date;
};

function Batches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBatchesData() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${SERVER_URL}/api/admin/batches`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch batches data");
        }

        const data = await response.json();

        setBatches(data.batches);

      } catch (err) {
        console.error(err);
        setError("Failed to load batches.");
      } finally {
        setLoading(false);
      }
    }

    fetchBatchesData();
  }, []);

  // Redirect to Editbatch
  async function handleEdit(id: string) {
    navigate(`/admin/batches/edit/${id}`)
  }
  // Delete batch function
  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this batch? The record will be removed from database."
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${SERVER_URL}/api/admin/batches/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete batch");
      }

      // Remove deleted batch from UI
      setBatches((prevBatches) =>
        prevBatches.filter((batch) => batch._id !== id)
      );

    } catch (error) {
      console.error(error);
      alert("Failed to delete batch.");
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-gray-600">Loading batches...</p>
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
          Batches
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
                <th className="border px-4 py-2">Item</th>
                <th className="border px-4 py-2">Supplier</th>
                <th className="border px-4 py-2">Batch Number</th>
                <th className="border px-4 py-2">Initial Quantity</th>
                <th className="border px-4 py-2">Current Quantity</th>
                <th className="border px-4 py-2">Expiry Date</th>
                <th className="border px-4 py-2">Received Date</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <tr key={batch._id} className="text-center">
                    <td className="border px-4 py-2">
                      {batch.item.name}
                    </td>

                    <td className="border px-4 py-2">
                      {batch.item.supplier.name}
                    </td>

                    <td className="border px-4 py-2">
                      {batch.batchNumber ?? "N/A"}
                    </td>

                    <td className="border px-4 py-2">
                      {batch.initialQuantity}
                    </td>

                    <td className="border px-4 py-2">
                      {batch.currentQuantity}
                    </td>

                    <td className="border px-4 py-2">
                      {batch.expiryDate
                        ? new Date(batch.expiryDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="border px-4 py-2">
                      {batch.receivedDate
                        ? new Date(batch.receivedDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="border px-4 py-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(batch._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(batch._id)}
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
                    colSpan={9}
                    className="border px-4 py-4 text-center text-gray-500"
                  >
                    No batches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Batches;