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

type Item = {
  _id: string;
  name: string;
};

function CreateBatch() {

  const navigate = useNavigate();

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [items, setItems] = useState<Item[]>([]);

  const [item, setItem] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [initialQuantity, setInitialQuantity] = useState<number | "">("");
  const [currentQuantity, setCurrentQuantity] = useState<number | "">("");
  const [expiryDate, setExpiryDate] = useState("");
  const [receivedDate, setReceivedDate] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchItems() {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${SERVER_URL}/api/admin/items`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }

        const data = await response.json();

        setItems(data.formattedItems || []);

      } catch (error) {

        console.error(error);
        alert("Failed to load items.");

      } finally {

        setLoading(false);

      }
    }

    fetchItems();

  }, [SERVER_URL]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${SERVER_URL}/api/admin/batches`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            item,
            batchNumber,
            initialQuantity,
            currentQuantity,
            expiryDate: expiryDate || null,
            receivedDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create batch");
      }

      alert("Batch created successfully");

      navigate("/admin/batches");

    } catch (error) {

      console.error(error);
      alert("Failed to create batch.");

    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p>Loading items...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="p-6 max-w-xl">
        <a className="font-medium" href="/admin/batches">
            ← Back
        </a>

        <h1 className="text-2xl font-bold mt-12 mb-6">
          Create Batch
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Item */}
          <div>

            <label className="block mb-1 font-medium">
              Item
            </label>

            <select
              value={item}
              onChange={(e) =>
                setItem(e.target.value)
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
                Select Item
              </option>

              {items.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                </option>
              ))}

            </select>

          </div>

          {/* Batch Number */}
          <div>

            <label className="block mb-1 font-medium">
              Batch Number
            </label>

            <input
              type="text"
              value={batchNumber}
              onChange={(e) =>
                setBatchNumber(e.target.value)
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

          {/* Initial Quantity */}
          <div>

            <label className="block mb-1 font-medium">
              Initial Quantity
            </label>

            <input
              type="number"
              value={initialQuantity}
              onChange={(e) =>
                setInitialQuantity(Number(e.target.value))
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

          {/* Current Quantity */}
          <div>

            <label className="block mb-1 font-medium">
              Current Quantity
            </label>

            <input
              type="number"
              value={currentQuantity}
              onChange={(e) =>
                setCurrentQuantity(Number(e.target.value))
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

          {/* Expiry Date */}
          <div>

            <label className="block mb-1 font-medium">
              Expiry Date
            </label>

            <input
              type="date"
              value={expiryDate}
              onChange={(e) =>
                setExpiryDate(e.target.value)
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

          {/* Received Date */}
          <div>

            <label className="block mb-1 font-medium">
              Received Date
            </label>

            <input
              type="date"
              value={receivedDate}
              onChange={(e) =>
                setReceivedDate(e.target.value)
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
            Create Batch
          </button>

        </form>

      </div>

    </AdminLayout>
  );
}

export default CreateBatch;