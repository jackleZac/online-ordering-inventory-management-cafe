import React from 'react';
import axios from "axios";
import { useSelector } from "react-redux";
import { itemsInCart, itemsTotalPrice } from "../redux/handleCart/CartSlice";
import { useNavigate } from "react-router-dom";
import { AddQuantity } from "../redux/handleCart/AddQuantity";
import { MinusQuantity } from "../redux/handleCart/MinusQuantity";
import { RemoveItem } from "../redux/handleCart/RemoveItem";
import { ProductCard } from "../components/productCard";

function Cart () {
    const navigate = useNavigate();

    const handleCheckout = async () => {
        navigate('/checkout');
    };

    // Retrieve existing items in a cart
    const items = useSelector(itemsInCart);

    // Retrieve total amount
    const total = useSelector(itemsTotalPrice);
    return (
        <div className="pt-36 pb-24 min-h-screen">
            <div className="w-3/4 mx-auto">
                <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
                {items.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        {items.map((item) => (
                        <ProductCard key={item._id} {...item} layout="row" />
                        ))}
                    </div>
                )}
            </div>
            <div className="w-3/4 mx-auto mt-8">
                <h3 className="text-lg font-bold mb-4">Total: RM{total}</h3>
                {items.length > 0 && (
                <button onClick={handleCheckout} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Checkout
                </button>
                )}
            </div>
        </div>
    );
};

export default Cart;