import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = ({ setView }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) return;

            const user = JSON.parse(savedUser);
            // Перестраховка: MongoDB іноді дає _id, іноді id
            const userId = user._id || user.id; 

            try {
                const { data } = await axios.get(`http://localhost:5000/api/orders/myorders?userId=${userId}`);
                setOrders(data);
            } catch (error) {
                console.error("Помилка завантаження історії:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="text-center py-20 text-gray-400">Завантаження історії...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-300 mb-4">Історія порожня 📜</h2>
                <button onClick={() => setView('shop')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition">
                    Зробити перше замовлення
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Мої замовлення 📦</h2>
            
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                        
                        <div className="flex flex-col md:flex-row justify-between border-b border-gray-700 pb-4 mb-4">
                            <div>
                                <p className="text-gray-400 text-sm">Номер замовлення:</p>
                                <p className="text-white font-mono text-sm">{order._id}</p>
                            </div>
                            <div className="mt-2 md:mt-0 text-right">
                                <p className="text-gray-400 text-sm">Дата:</p>
                                <p className="text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-4">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 bg-gray-900/50 p-3 rounded-lg">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-16 h-16 object-contain bg-white rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="text-white font-medium text-sm md:text-base line-clamp-2">{item.name}</p>
                                        <p className="text-gray-500 text-sm">x{item.qty}</p>
                                    </div>
                                    <div className="text-blue-400 font-bold">
                                        ${item.price}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                    {order.isDelivered ? 'Доставлено' : 'В обробці'}
                                </span>
                            </div>
                            <div className="text-xl font-bold text-green-400">
                                Всього: ${order.totalPrice}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;