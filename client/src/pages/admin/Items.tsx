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

type ItemCatalog = {
  _id: string;
  name: string;
  supplier?: string;
  unit?: string;
  threshold?: number;
  isPerishable?: boolean;
};

function Items() {
  const [items, setItems] = useState<ItemCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate()
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    async function fetchItemsData() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${SERVER_URL}/api/admin/items`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch items data");
        }

        const data = await response.json();

        setItems(data.formattedItems);
      } catch (err) {
        console.error(err);
        setError("Failed to load items.");
      } finally {
        setLoading(false);
      }
    }

    fetchItemsData();
  }, []);
  
  // Redirect to CreateItem
  async function handleCreate(){
    navigate("/admin/items/create")
  };

  // Redirect to EditItem
  async function handleEdit(id: string){
    navigate(`/admin/items/edit/${id}`);
  };

  // Delete item function
  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${SERVER_URL}/api/admin/items/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Remove deleted item from UI
      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      );

    } catch (error) {
      console.error(error);
      alert("Failed to delete item.");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-gray-600">Loading items...</p>
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
          Item Catalog
        </h1>
        <div className="flex flex-row-reverse">
          <button
            onClick={() => handleCreate()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 my-6 rounded"
          >
            Add
          </button>
          </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Supplier</th>
                <th className="border px-4 py-2">Unit</th>
                <th className="border px-4 py-2">Threshold</th>
                <th className="border px-4 py-2">Perishable</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id} className="text-center">
                    <td className="border px-4 py-2">
                      {item.name}
                    </td>

                    <td className="border px-4 py-2">
                      {item.supplier}
                    </td>

                    <td className="border px-4 py-2">
                      {item.unit}
                    </td>

                    <td className="border px-4 py-2">
                      {item.threshold ?? "N/A"}
                    </td>

                    <td className="border px-4 py-2">
                      {item.isPerishable ? "Yes" : "No"}
                    </td>

                    <td className="border px-4 py-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
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
                    colSpan={6}
                    className="border px-4 py-4 text-center text-gray-500"
                  >
                    No items found.
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

export default Items;