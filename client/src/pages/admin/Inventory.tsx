import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

declare global {
  interface ImportMeta {
    env: {
      VITE_SERVER_URL: string;
    };
  }
}

type Supplier = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

type ItemCatalog = {
  _id: string;
  name: string;
  supplier: string;
  unit?: string;
  threshold?: number;
  isPerishable?: boolean;
};

type LowStockItem = {
  itemId: string;
  name: string;
  supplier?: string;
  unit?: string;
  threshold: number;
  totalQuantity: number;
};

type UsedUnitsPerItem = {
  itemId: string;
  itemName: string;
  supplier?: string;
  totalUsedUnits: number;
  usedBatchCount: number;
};

type InventoryData = {
  totalItems: number;
  totalBatches: number;
  totalUsedUnits: number;
  perishableItems: number;
  nonPerishableItems: number;
  expiredBatches: number;
  lowStockItems: LowStockItem[];
  suppliers: Supplier[];
  itemCatalogs: ItemCatalog[];
  totalUsedUnitsPerItems: UsedUnitsPerItem[];
};

function Inventory() {
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  
  useEffect(() => {
    async function fetchInventoryData() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${SERVER_URL}/api/admin/inventory`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch inventory data");
        }

        const data = await response.json();
        console.log(data);
        setInventoryData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load inventory data.");
      } finally {
        setLoading(false);
      }
    }

    fetchInventoryData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-gray-600">Loading inventory data...</p>
        </div>
      </AdminLayout>
    );
  };

  if (error || !inventoryData) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-red-600">{error || "No inventory data found."}</p>
        </div>
      </AdminLayout>
    );
  };

  const overviewCards = [
    {
      title: "Total Items",
      value: inventoryData.totalItems,
    },
    {
      title: "Total Batches",
      value: inventoryData.totalBatches,
    },
    {
      title: "Total Used Units",
      value: inventoryData.totalUsedUnits,
    },
    {
      title: "Perishable Items",
      value: inventoryData.perishableItems,
    },
    {
      title: "Non-Perishable Items",
      value: inventoryData.nonPerishableItems,
    },
    {
      title: "Expired Batches",
      value: inventoryData.expiredBatches,
    },
  ];

  const donutChartData = {
    labels: ["Perishable", "Non-Perishable", "Expired Batches"],
    datasets: [
      {
        label: "Inventory Status",
        data: [
          inventoryData.perishableItems,
          inventoryData.nonPerishableItems,
          inventoryData.expiredBatches,
        ],
        backgroundColor: ["#2563eb", "#16a34a", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <section>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Inventory Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
            {overviewCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <p className="text-sm text-gray-500">{card.title}</p>
                <h2 className="text-2xl font-bold text-gray-800 mt-2">
                  {card.value}
                </h2>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Inventory Composition
              </h2>

              <div className="h-80">
                <Doughnut data={donutChartData} options={donutChartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Item Catalog
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Supplier</th>
                      <th className="px-4 py-3">Unit</th>
                      <th className="px-4 py-3">Threshold</th>
                      <th className="px-4 py-3">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.itemCatalogs.length > 0 ? (
                      inventoryData.itemCatalogs.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {item.supplier || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {item.unit || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {item.threshold ?? "-"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                item.isPerishable
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {item.isPerishable
                                ? "Perishable"
                                : "Non-Perishable"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          No item catalog found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Total Used Units Per Item
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Supplier</th>
                      <th className="px-4 py-3">Used Units</th>
                      <th className="px-4 py-3">Used Batches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.totalUsedUnitsPerItems.length > 0 ? (
                      inventoryData.totalUsedUnitsPerItems.map((item) => (
                        <tr
                          key={item.itemId}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {item.itemName}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {item.supplier || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {item.totalUsedUnits}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {item.usedBatchCount}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          No usage record found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Low-Stock Items
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3">Threshold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.lowStockItems.length > 0 ? (
                      inventoryData.lowStockItems.map((item) => (
                        <tr
                          key={item.itemId}
                          className="border-b border-gray-100 hover:bg-red-50"
                        >
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.supplier || "-"}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-red-600 font-semibold">
                            {item.totalQuantity} {item.unit || ""}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {item.threshold}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          No low-stock item found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Supplier Records
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Supplier</th>
                      <th className="px-4 py-3">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.suppliers.length > 0 ? (
                      inventoryData.suppliers.map((supplier) => (
                        <tr
                          key={supplier._id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-800">
                              {supplier.name || "-"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {supplier.address || ""}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            <p>{supplier.email || "-"}</p>
                            <p className="text-xs text-gray-500">
                              {supplier.phone || ""}
                            </p>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          No supplier found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default Inventory;