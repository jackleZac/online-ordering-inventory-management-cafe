import axios from "axios";
import { useSelector } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { itemsInCart, itemsTotalPrice } from "../redux/handleCart/CartSlice";
import { AddQuantity } from "../redux/handleCart/AddQuantity";
import { MinusQuantity } from "../redux/handleCart/MinusQuantity";
import { RemoveItem } from "../redux/handleCart/RemoveItem";

export const Cart = () => {
    // Retrieve existing items in a cart
    const items = useSelector(itemsInCart);

    // Retrieve total amount
    const total = useSelector(itemsTotalPrice);

    const stripe = useStripe();
    const elements = useElements();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const handleCheckout = async () => {
        if (!stripe || !elements) return;

        // Stripe needs amount in cents
        const res = await axios.post(
        `${SERVER_URL}/stripe/create-payment-intent`,
        { amount: total * 100 }
        );

        const { clientSecret } = res.data;

        const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.getElement(CardElement),
        },
        });

        if (result.error) {
        alert(result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
        alert("Payment successful 🎉");
        }
    };

    return (
        <div className="m-2 p-2 bg-[#ffffff] border-black rounded shadow-md">
            <h2 className="text-center font-bold text-xl py-2">CART</h2>
            <div className="p-4 mt-2 overflow-y-auto">
                {items.length == 0 ? <p className="text-center">Empty</p> : 
                <ul>
                    {items.map((eachItem) => (
                        <li key={eachItem._id}>
                            <div className="flex p-2 w-full border-b">
                                <div className="w-3/5 truncate">
                                    <div className="text-base">{eachItem.name}</div>
                                    <div className="text-sm">RM{eachItem.accPrice}</div>
                                </div>
                                <div className="w-2/5 pl-2 flex my-auto text-center">
                                    <AddQuantity {...eachItem}/>
                                    <div className="basis-1/2 m-2">{eachItem.quantity}</div>
                                    <MinusQuantity {...eachItem} />
                                    <div className="mx-2 my-auto"><RemoveItem {...eachItem} /></div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>}
            </div>
            <div className="w-full p-4 grid max-md:grid-cols-1">
                <div className="basis-1/2 text-lg">Delivery Fee: Free</div>
                <div className="basis-1/2 font-bold text-sm">Total: RM{total}</div>
            </div>
            <div className="mt-4 p-2 border rounded">
                <CardElement />
            </div>
            <button
                onClick={handleCheckout}
                disabled={!stripe}
                className="w-full mt-4 p-3 text-white bg-[#373333] font-bold"
            >
                CHECKOUT
            </button>
        </div>
    )
}