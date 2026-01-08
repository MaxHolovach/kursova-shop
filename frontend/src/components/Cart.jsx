import React from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cart = ({ user, setView }) => { 
    const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
    
    const SERVER_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://my-shop-api-rgya.onrender.com';

    const handleCheckout = async () => {
        if (!user) {
            toast.error("Будь ласка, увійдіть, щоб оформити замовлення");
            setView('login'); 
            return;
        }

        try {
            await axios.post(`${SERVER_URL}/api/orders`, {
                userId: user._id || user.googleId,
                items: cartItems,
                totalAmount: totalPrice
            });

            toast.success("Замовлення успішно оформлено!");
            clearCart();
        } catch (error) {
            console.error(error);
            toast.error("Помилка оформлення замовлення");
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
                <h2 className="text-3xl font-bold mb-4">Ваш кошик порожній 🛒</h2>
                <p className="text-gray-400 mb-8">Схоже, ви ще нічого не додали.</p>
                <button 
                    onClick={() => setView('shop')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                >
                    Перейти до товарів
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 text-white">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-4">Ваш Кошик</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Список товарів */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.asin || item._id} className="bg-gray-800 p-4 rounded-lg flex items-center gap-4">
                            <img 
                                src={item.product_photo || item.image || "https://via.placeholder.com/100"} 
                                alt={item.product_title} 
                                className="w-24 h-24 object-contain bg-white rounded-md"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold text-lg line-clamp-2">{item.product_title || item.title || item.name}</h3>
                                <p className="text-gray-400">Ціна: {item.product_price || item.price}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-sm text-gray-500">Кількість: {item.quantity}</span>
                                    <button 
                                        onClick={() => removeFromCart(item.asin || item._id)}
                                        className="text-red-500 hover:text-red-400 text-sm transition"
                                    >
                                        Видалити
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Блок оплати */}
                <div className="bg-gray-800 p-6 rounded-lg h-fit sticky top-20">
                    <h3 className="text-xl font-bold mb-4">Разом до сплати</h3>
                    <div className="flex justify-between mb-2">
                        <span>Товарів:</span>
                        <span>{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between mb-6 text-2xl font-bold text-green-400">
                        <span>Сума:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                    >
                        Оформити замовлення
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;