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

type Item = {
  _id: string;
  name: string;
  supplier: {
    _id: string;
    name: string;
  };
  unit: string;
  isPerishable: boolean;
  threshold?: number;
};

function EditItem() {

  const { id } = useParams();
  const navigate = useNavigate();

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [unit, setUnit] = useState("");
  const [isPerishable, setIsPerishable] = useState(false);
  const [threshold, setThreshold] = useState<number | "">("");

  useEffect(() => {

    async function fetchItem() {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${SERVER_URL}/api/admin/items/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch item");
        }

        const data = await response.json();

        const item: Item = data.item;

        setName(item.name);
        setSupplierName(item.supplier.name);
        setUnit(item.unit);
        setIsPerishable(item.isPerishable);
        setThreshold(item.threshold ?? "");

      } catch (error) {

        console.error(error);
        alert("Failed to load item.");

      } finally {

        setLoading(false);

      }
    }

    fetchItem();

  }, [id]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${SERVER_URL}/api/admin/items/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            unit,
            isPerishable,
            threshold:
              threshold === "" ? null : threshold,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      alert("Item updated successfully.");

      navigate("/admin/items");

    } catch (error) {

      console.error(error);
      alert("Failed to update item.");

    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p>Loading item...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="p-6 max-w-xl">

        <h1 className="text-2xl font-bold mb-6">
          Edit Item
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Item Name */}
          <div>
            <label className="block mb-1 font-medium">
              Item Name
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

          {/* Supplier (Read Only) */}
          <div>
            <label className="block mb-1 font-medium">
              Supplier
            </label>

            <input
              type="text"
              value={supplierName}
              disabled
              className="
                w-full
                border
                rounded-lg
                px-4
                py-2
                bg-gray-100
                cursor-not-allowed
              "
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block mb-1 font-medium">
              Unit
            </label>

            <input
              type="text"
              value={unit}
              onChange={(e) =>
                setUnit(e.target.value)
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

          {/* Perishable */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPerishable}
              onChange={(e) =>
                setIsPerishable(e.target.checked)
              }
            />

            <label className="font-medium">
              Perishable Item
            </label>
          </div>

          {/* Threshold */}
          <div>
            <label className="block mb-1 font-medium">
              Low Stock Threshold
            </label>

            <input
              type="number"
              value={threshold}
              onChange={(e) =>
                setThreshold(Number(e.target.value))
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
            Update Item
          </button>

        </form>

      </div>

    </AdminLayout>
  );
}

export default EditItem;