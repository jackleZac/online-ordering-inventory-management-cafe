import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { itemsInCart } from "../redux/handleCart/CartSlice";
import { IoCartOutline } from "react-icons/io5";
import { VscCoffee } from "react-icons/vsc";
import { GiTacos } from "react-icons/gi";
import { IoFastFoodOutline } from "react-icons/io5";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ProductCard } from "../components/productCard";
import { selectRole } from "../redux/auth/AuthSlice";
import CreateProductDrawer from "../components/Modal/CreateProduct";
import EditProductDrawer from "../components/Modal/EditProduct";

function Menu() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState(null);
  const [cartMobile, setCartMobile] = useState(false);
  const [cartQty, countCartQty] = useState(0);
  const [ws, setWs] = useState(null);

  const [isCreateProductModalVisible, setIsCreateProductModalVisible] = useState(false);
  const [isEditProductModalVisible, setIsEditProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const isAdmin = useSelector(selectRole);
  console.log("Redux isAdmin:", isAdmin);
  
  // Fetch menu items
  const fetchData = async () => {
    try {
      const response = filter
        ? await axios.get(`${SERVER_URL}/api/menu/${filter}`)
        : await axios.get(`${SERVER_URL}/api/menu`);
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    // Connect to WebSocket server
    const websocket = new WebSocket('ws://localhost:8080');
    setWs(websocket);

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // New product created
      if (message.type === 'NEW_MENU_ITEM') {
        console.log('New menu item received:', message.product);
        setProducts(prev => [...prev, message.product]); // Add new item to menu
      };

      // A product updated
      if (message.type === 'UPDATED_MENU_ITEM'){
        console.log('An updated item received:', message.product);
        setProducts(products.map(p =>
          p._id === message.product._id ? message.product : p // Update product details
        ));
      };

      // A product deleted
      if (message.type === 'DELETED_MENU_ITEM'){
        console.log('Deleted menu item received:', message.product);
        setProducts(products.filter(p => p._id !== message.product._id));
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      websocket.close(); // Clean up on component unmount
    };
  }, [filter]);

  // Update cart quantity
  const items = useSelector(itemsInCart);
  useEffect(() => {
    const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);
    countCartQty(totalQty);
  }, [items]);

  const handleFilter = (id) => setFilter(id);
  const handleCartMobile = () => setCartMobile(!cartMobile);

  // Admin functionalitiy - delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await axios.delete(`${SERVER_URL}/api/menu/${productId}`);
      console.log(res.data.deletedProduct)
      const deletedProduct = res.data.deletedProduct;
      if (res.status === 200) {
        alert(`${deletedProduct} is successfully deleted`)
      };
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pt-24 p bg-[#f5f5ef]">
      {/* Create Product Drawer (admin only) */}
      {isAdmin && (
        <CreateProductDrawer
          open={isCreateProductModalVisible}
          onClose={() => setIsCreateProductModalVisible(false)}
        />
      )}

      {/* Edit Product Drawer (admin only) */}
      {isAdmin && selectedProduct && (
        <EditProductDrawer
          open={isEditProductModalVisible}
          onClose={() => setIsEditProductModalVisible(false)}
          product={selectedProduct}
        />
      )}

      <div className="flex lg:flex-row max-md:flex-col min-h-screen">
        <div className="w-auto md:w-full max-md:mt-32 px-20">
          {/* Admin create button (admin only) */}
          {isAdmin && (
            <div className="mb-4">
              <button
                onClick={() => setIsCreateProductModalVisible(true)}
                className="px-4 py-2 m-2 bg-black text-white rounded-lg"
              >
                + Add Product
              </button>
            </div>
          )}

          {/* Filter buttons */}
          <div className="flex justify-center mb-4 mt-12">
            <div className="max-md:fixed max-md:top-24">
              <div className="m-2 bg-white shadow-lg flex flex-col border-1 rounded-lg">
                <h2 className="m-2 font-bold text-center text-xl">MENU</h2>
                <div className="m-4 border-2 rounded-lg flex flex-row max-md:flex-row">
                  <button
                    className="px-4 py-2 w-full hover:bg-slate-200 flex flex-row"
                    onClick={() => handleFilter(null)}
                  >
                    <IoFastFoodOutline className="mx-2" />
                    <p>All</p>
                  </button>
                  <button
                    className="px-4 py-2 w-full hover:bg-slate-200 flex flex-row"
                    onClick={() => handleFilter("coffee")}
                  >
                    <VscCoffee className="mx-2" />
                    <p>Coffee</p>
                  </button>
                  <button
                    className="px-4 py-2 w-full hover:bg-slate-200 flex flex-row"
                    onClick={() => handleFilter("wraps")}
                  >
                    <GiTacos className="mx-2" />
                    <p>Wraps</p>
                  </button>
                  <button
                    className="px-4 py-2 w-full hover:bg-slate-200 flex flex-row"
                    onClick={() => handleFilter("pastry")}
                  >
                    <GiTacos className="mx-2" />
                    <p>Pastry</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Product list (public) */}
          <div className="flex lg:flex-rows max-sm:flex-col flex-wrap gap-4 justify-center">
            {isAdmin && products.length == 0 ? (
              <div className="flex w-full min-h-screen justify-center items-center">
                <p>No products found. Create one to get started.</p>
              </div>
            ) : !isAdmin && products.length == 0 ? (
              <div className="flex w-full min-h-screen justify-center items-center">
                <p>No products available at the moment.</p>
              </div>
            ) : (
              products.map((product) => (
              <div key={product._id} className="relative">
                <ProductCard {...product} />

                {/* Admin edit/delete buttons */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsEditProductModalVisible(true);
                      }}
                      className="bg-amber-900 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
