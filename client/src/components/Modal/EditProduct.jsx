import { useEffect, useState } from "react";
import axios from "axios";
import Drawer from "./Drawer";

const EditProductDrawer = ({ open, onClose, product }) => {
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (image) formData.append("image", image);

    try {
      const res = await axios.put(
        `${SERVER_URL}/api/menu/${product._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const updatedProduct = res.data.updatedProduct;
      if (res.status === 200){
        alert(`${updatedProduct.name} is successfully update!`);
      };
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return null;

  return (
    <Drawer open={open} onClose={onClose} title="Edit Product">
      {/* Edit product details*/}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="price"
          type="number"
          value={form.price || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="category"
          value={form.category || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="coffee">Coffee</option>
          <option value="meals">Meals</option>
        </select>

        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
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

        <button className="w-full bg-black text-white p-2 rounded rounded">
          Update Product
        </button>
      </form>
    </Drawer>
  );
};

export default EditProductDrawer;
