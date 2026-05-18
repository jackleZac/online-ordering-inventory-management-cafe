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

type Batch = {
  _id: string;
  item: {
    _id: string;
    name: string;
  };
  batchNumber?: string;
  initialQuantity: number;
  currentQuantity: number;
  expiryDate?: string;
  receivedDate: string;
  isUsed: boolean;
};

function EditBatch() {

  const { id } = useParams();
  const navigate = useNavigate();

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [loading, setLoading] = useState(true);

  const [itemName, setItemName] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [initialQuantity, setInitialQuantity] = useState(0);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [isUsed, setIsUsed] = useState(false);

  useEffect(() => {

    async function fetchBatch() {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${SERVER_URL}/api/admin/batches/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch batch");
        }

        const data = await response.json();

        const batch: Batch = data.batch;

        setItemName(batch.item.name);
        setBatchNumber(batch.batchNumber ?? "");
        setInitialQuantity(batch.initialQuantity);
        setCurrentQuantity(batch.currentQuantity);

        setExpiryDate(
          batch.expiryDate
            ? batch.expiryDate.split("T")[0]
            : ""
        );

        setReceivedDate(
          batch.receivedDate
            ? batch.receivedDate.split("T")[0]
            : ""
        );

        setIsUsed(batch.isUsed);

      } catch (error) {

        console.error(error);
        alert("Failed to load batch.");

      } finally {

        setLoading(false);

      }
    }

    fetchBatch();

  }, [id]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${SERVER_URL}/api/admin/batches/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            batchNumber,
            initialQuantity,
            currentQuantity,
            expiryDate: expiryDate || null,
            receivedDate,
            isUsed
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update batch");
      }

      alert("Batch updated successfully.");

      navigate("/admin/batches");

    } catch (error) {

      console.error(error);
      alert("Failed to update batch.");

    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p>Loading batch...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="p-6 max-w-xl">

        <h1 className="text-2xl font-bold mb-6">
          Edit Batch
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

            <input
              type="text"
              value={itemName}
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

          {/* Is Used */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isUsed}
              onChange={(e) =>
                setIsUsed(e.target.checked)
              }
            />

            <label className="font-medium">
              Batch Fully Used
            </label>
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
            Update Batch
          </button>

        </form>

      </div>

    </AdminLayout>
  );
}

export default EditBatch;