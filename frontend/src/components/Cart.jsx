import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Cart = ({ setView }) => {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
  const [address, setAddress] = useState(''); // Стан для адреси
  const [isSubmitting, setIsSubmitting] = useState(false); // Стан "Відправка..."

  // Якщо кошик порожній
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-300 mb-4">Ваш кошик порожній 😢</h2>
        <button 
          onClick={() => setView('shop')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
        >
          Перейти до товарів
        </button>
      </div>
    );
  }

  // Функція оформлення
  const handleCheckout = async () => {
    // 1. Перевіряємо авторизацію
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      alert('Будь ласка, увійдіть в акаунт, щоб оформити замовлення!');
      setView('login');
      return;
    }

    // 2. Перевіряємо адресу
    if (!address.trim()) {
      alert('Будь ласка, введіть адресу доставки');
      return;
    }

    const user = JSON.parse(savedUser);
    setIsSubmitting(true);

    try {
      // 3. Відправляємо на сервер
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id, // ID беремо з збереженого юзера
          items: cartItems,
          totalAmount: totalPrice,
          shippingAddress: address
        })
      });

      if (response.ok) {
        toast.success('Замовлення успішно оформлено! 🛒', { theme: "dark" });
        clearCart();
        setView('shop');
      } else {
        alert('Помилка при оформленні. Спробуйте ще раз.');
      }
    } catch (error) {
      console.error(error);
      alert('Помилка з\'єднання з сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white">Кошик</h2>
      </div>

      <div className="divide-y divide-gray-700 max-h-[400px] overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item._id} className="p-6 flex items-center gap-6">
            <img 
              src={item.image || item.imageUrl}
              alt={item.name} 
              className="w-20 h-20 object-cover rounded-md bg-white" 
            />
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{item.name}</h3>
              <p className="text-gray-400 text-sm">{item.brand}</p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-blue-400">${item.price}</p>
              <p className="text-gray-500 text-sm">x {item.quantity}</p>
            </div>

            <button
              onClick={() => removeFromCart(item._id)}
              className="p-2 text-gray-400 hover:text-red-500 transition"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-900 border-t border-gray-700">
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Адреса доставки:</label>
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Введіть місто та відділення пошти..."
            className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400">До сплати:</p>
            <p className="text-3xl font-bold text-white">{totalPrice}$</p>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition ${
              isSubmitting 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isSubmitting ? 'Обробка...' : 'Підтвердити замовлення'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;