import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

declare global {
  interface ImportMeta {
    env: {
      VITE_SERVER_URL: string;
    };
  }
}

type OrdersOverview = {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  refundOrders: number;
};

type OrderTrendDataset = {
  menuId: string;
  label: string;
  category: string;
  data: number[];
};

type OrderTrendByProduct = {
  labels: string[];
  monthKeys: string[];
  datasets: OrderTrendDataset[];
};

type ProductSummary = {
  menuId: string;
  productName: string;
  category: string;
  totalOrderRecords: number;
  totalQuantitySold: number;
};

function Orders() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [ordersOverview, setOrdersOverview] = useState<OrdersOverview | null>(
    null
  );

  const [orderTrendByProduct, setOrderTrendByProduct] =
    useState<OrderTrendByProduct | null>(null);

  const [productSummary, setProductSummary] = useState<ProductSummary[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrdersData() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${SERVER_URL}/api/admin/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders data");
        }

        const data = await response.json();

        setOrdersOverview(data.overview);
        console.log(ordersOverview);
        setOrderTrendByProduct(data.orderTrendByProduct);
        setProductSummary(data.productSummary || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders data.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrdersData();
  }, [SERVER_URL]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-gray-600">Loading orders data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !ordersOverview || !orderTrendByProduct) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-red-600">
            {error || "No orders data available."}
          </p>
        </div>
      </AdminLayout>
    );
  }

  const overviewCards = [
    {
      title: "Total Orders This Month",
      value: ordersOverview.totalOrders || 0,
    },
    {
      title: "Pending Orders",
      value: ordersOverview.pendingOrders || 0,
    },
    {
      title: "Completed Orders",
      value: ordersOverview.completedOrders || 0,
    },
    {
      title: "Refund Orders",
      value: ordersOverview.refundOrders || 0,
    },
  ];

  const hasTrendData =
    orderTrendByProduct.datasets &&
    orderTrendByProduct.datasets.length > 0;

  const chartData = {
    labels: orderTrendByProduct.labels,
    datasets: orderTrendByProduct.datasets.map((item) => ({
      label: item.label,
      data: item.data,
      borderWidth: 2,
      tension: 0.3,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <section>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Orders Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {overviewCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
              >
                <p className="text-sm text-gray-500">{card.title}</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {card.value}
                </h2>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Trend of Orders Per Product
                </h2>
                <p className="text-sm text-gray-500">
                  Based on quantity sold from the past 12 months.
                </p>
              </div>
            </div>

            {hasTrendData ? (
              <div className="h-96">
                <Line data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No product order data found.</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Product Sales Summary
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Order Records</th>
                    <th className="px-4 py-3">Quantity Sold</th>
                  </tr>
                </thead>

                <tbody>
                  {productSummary.length > 0 ? (
                    productSummary.map((item) => (
                      <tr
                        key={item.menuId}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.productName}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {item.category}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {item.totalOrderRecords}
                        </td>

                        <td className="px-4 py-3 font-semibold text-gray-800">
                          {item.totalQuantitySold}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No product summary found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default Orders;