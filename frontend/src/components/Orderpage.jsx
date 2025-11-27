import { useState ,useEffect} from "react";
const API_URL=import.meta.env.VITE_API_URL;





const OrdersPage = () => {
  console.log("Order page");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div className="empty-orders">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <h3>No orders yet</h3>
          <p>Your purchased projects will appear here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <span className={`status-badge ${order.status}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-projects">
                {order.projects.map(project => (
                  <div key={project._id} className="order-project">
                    <div className="project-details">
                      <h4>{project.title}</h4>
                      <p>{project.category}</p>
                    </div>
                    {order.status === 'completed' && (
                      <div className="download-buttons">
                        <a
                          href={project.fileUrls.report}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-download"
                        >
                          📄 Report
                        </a>
                        <a
                          href={project.fileUrls.ppt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-download"
                        >
                          📊 PPT
                        </a>
                        <a
                          href={project.fileUrls.code}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-download"
                        >
                          💾 Code
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <span>Total Amount</span>
                <span className="order-total">₹{order.amount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default OrdersPage;
