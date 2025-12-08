import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const CartPage = ({ cart, removeFromCart,clearCart }) => {
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // 🔒 Debounce / cooldown reference
  const checkoutCooldown = useRef(false);

const handleCheckout = async () => {
    // ⛔ Prevent multiple calls within 10 sec
    if (checkoutCooldown.current) {
      // alert("Please wait 10 seconds before trying again.");
      return;
    }

    // 🔒 Start cooldown
    checkoutCooldown.current = true;
    setTimeout(() => {
      checkoutCooldown.current = false;
    }, 10000); // 10 seconds

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projects: cart.map(p => p._id),
          amount: total
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const data = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxx',
        amount: data.amount,
        currency: 'INR',
        name: 'ProjectBazar',
        description: 'Project Purchase',
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(response)
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              alert('Payment successful! Check your orders.');
              navigate('/orders');
            } else {
              alert('Payment verification failed');
            }
          } catch (err) {
            alert('Payment verification failed: ' + err.message);
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#4F46E5'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert('Checkout failed: ' + err.message);
    }
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h3>Your cart is empty</h3>
          <p>Add some projects to get started!</p>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-info">
                  <h3>{item.title}</h3>
                  <p>{item.category}</p>
                </div>
                <div className="item-actions">
                  <span className="item-price">₹{item.price}</span>
                  <button onClick={() => removeFromCart(item._id)} className="btn-remove">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-row">
              <span>Total</span>
              <span className="total-amount">₹{total}</span>
            </div>

            {/* ⛔ Disable during cooldown */}
            <button
              onClick={handleCheckout}
              className="btn-checkout"
              disabled={checkoutCooldown.current}
            >
              {checkoutCooldown.current ? "Please wait..." : "Proceed to Checkout"}
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
