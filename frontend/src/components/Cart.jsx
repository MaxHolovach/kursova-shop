import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { toast } from 'react-toastify';

const SERVER_URL = 'https://my-shop-api-rgya.onrender.com';

const Cart = ({ setView }) => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("Будь ласка, увійдіть в акаунт, щоб зробити замовлення!");
      setView('login');
      return;
    }

    if (cart.length === 0) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${SERVER_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user._id || user.id,
          products: cart,
          totalPrice: totalPrice
        })
      });

      if (response.ok) {
        toast.success("Замовлення успішно оформлено! 🚀");
        clearCart();
        setView('orders');
      } else {
        alert("Помилка при оформленні.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Не вдалося з'єднатися з сервером.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-white mt-6">
      <h2 className="text-2xl font-bold mb-6">Ваш кошик</h2>

      {cart.length === 0 ? (
        <p className="text-gray-400">Кошик порожній 🛒</p>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-white rounded" />
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-green-400">${item.price}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-400 hover:text-red-300 font-bold"
                >
                  Видалити
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-gray-600 pt-6">
            <div className="text-2xl font-bold">Всього: ${totalPrice.toFixed(2)}</div>
            <button 
              onClick={handleCheckout}
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
            >
              {isSubmitting ? 'Обробка...' : 'Оформити замовлення'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;