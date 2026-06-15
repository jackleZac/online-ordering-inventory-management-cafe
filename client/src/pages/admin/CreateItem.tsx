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
};

function CreateItem() {

  const navigate = useNavigate();

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [unit, setUnit] = useState("");
  const [isPerishable, setIsPerishable] = useState(false);
  const [threshold, setThreshold] = useState<number | "">("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchSuppliers() {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${SERVER_URL}/api/admin/suppliers`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch suppliers");
        }

        const data = await response.json();

        setSuppliers(data.suppliers || []);

      } catch (error) {

        console.error(error);
        alert("Failed to load suppliers.");

      } finally {

        setLoading(false);

      }
    }

    fetchSuppliers();

  }, [SERVER_URL]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${SERVER_URL}/api/admin/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            supplier,
            unit,
            isPerishable,
            threshold:
              threshold === "" ? null : threshold,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create item");
      }

      alert("Item created successfully");

      navigate("/admin/items");

    } catch (error) {

      console.error(error);
      alert("Failed to create item.");

    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p>Loading suppliers...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="p-6 max-w-xl">
        <a className="font-medium" href="/admin/items">
            ← Back
        </a>

        <h1 className="text-2xl font-bold mt-12 mb-6">
          Create Item
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

          {/* Supplier */}
          <div>

            <label className="block mb-1 font-medium">
              Supplier
            </label>

            <select
              value={supplier}
              onChange={(e) =>
                setSupplier(e.target.value)
              }
              required
              className="
                w-full
                border
                rounded-lg
                px-4
                py-2
              "
            >

              <option value="">
                Select Supplier
              </option>

              {suppliers.map((supplier) => (
                <option
                  key={supplier._id}
                  value={supplier._id}
                >
                  {supplier.name}
                </option>
              ))}

            </select>

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
            Create Item
          </button>

        </form>

      </div>

    </AdminLayout>
  );
}

export default CreateItem;