import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

// Replace with your Stripe publishable key (safe to expose client-side)
const stripePromise = loadStripe("pk_test_replace_with_your_key");

function CheckoutForm({ clientSecret, orderItems, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ line1: "", city: "", state: "", postalCode: "", country: "" });
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      const { data: order } = await api.post("/orders/confirm", {
        paymentIntentId: paymentIntent.id,
        orderItems,
        total,
        shippingAddress: address,
      });
      clearCart();
      navigate(`/orders/${order._id}`, { replace: true });
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold">Shipping Address</h2>
      {["line1", "city", "state", "postalCode", "country"].map((field) => (
        <input
          key={field}
          placeholder={field}
          value={address[field]}
          onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
          className="w-full border rounded-md px-4 py-2"
          required
        />
      ))}
      <h2 className="text-xl font-semibold pt-4">Payment</h2>
      <div className="border rounded-md px-4 py-3">
        <CardElement />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-emerald-600 text-white py-2 rounded-md disabled:opacity-50"
      >
        {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { items, total } = useCart();
  const [clientSecret, setClientSecret] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    if (items.length === 0) return;
    api
      .post("/orders/create-payment-intent", {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      })
      .then(({ data }) => {
        setClientSecret(data.clientSecret);
        setOrderItems(data.orderItems);
      });
  }, [items]);

  if (!clientSecret) return <p className="p-6">Preparing checkout...</p>;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm clientSecret={clientSecret} orderItems={orderItems} total={total} />
    </Elements>
  );
}
