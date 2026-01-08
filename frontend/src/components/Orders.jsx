import { useEffect, useState } from 'react';

const SERVER_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://my-shop-api-rgya.onrender.com';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      try {
        const response = await fetch(`${SERVER_URL}/api/orders/${user._id || user.id}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Помилка завантаження замовлень:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center text-white py-10">Завантаження замовлень...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-white mt-6">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Мої замовлення</h2>
      
      {orders.length === 0 ? (
        <p className="text-gray-400">Ви ще нічого не замовляли.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-green-400">Замовлення #{order._id.slice(-6)}</span>
                <span className="text-sm text-gray-300">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                <p>Сума: <span className="font-bold text-white">${order.totalPrice}</span></p>
                <p>Статус: {order.isPaid ? 'Оплачено ✅' : 'В обробці ⏳'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;