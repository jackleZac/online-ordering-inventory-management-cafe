import { useState } from "react";
import axios from "axios";
import Drawer from "./Drawer";

const CreateProductDrawer = ({ open, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "coffee",
    description: ""
  });
  const [image, setImage] = useState(null);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const handleChange = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("image", image);
      const res = await axios.post(
        `${SERVER_URL}/api/menu`, 
          formData, { 
            withCredentials: true, 
            headers: {"Content-Type": "multipart/form-data"}
        }
      );
      const createdProduct = res.data.createdProduct;
      if (res.status === 201){
        alert(`${createdProduct.name} is successfully created!`);
      };
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Drawer open={open} onClose={onClose} title="Create Product">
      {/* Enter product details*/}
      <form onSubmit={handleCreateProduct} className="space-y-4">
        <input
          name="name"
          placeholder="Product name"
          className="w-full border p-4"
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full border p-4"
          onChange={handleChange}
        />

        <select
          name="category"
          className="w-full border p-4"
          onChange={handleChange}
        >
          <option value="coffee">Coffee</option>
          <option value="meals">Meals</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-4"
          onChange={handleChange}
        />

        <div className="space-y-2">
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />

            <label
              htmlFor="image-upload"
              className="cursor-pointer inline-block w-full text-center bg-gray-200 hover:bg-gray-300 text-black py-2 rounded transition"
            >
              {image ? "Change Image" : "Upload Image"}
            </label>

            {image && (
              <p className="text-sm text-gray-600">
                Selected: {image.name}
              </p>
            )}
        </div>

        <button className="w-full bg-black text-white p-4 rounded">
          Create Product
        </button>
      </form>
    </Drawer>
  );
};

export default CreateProductDrawer;
