import { useState } from 'react';

const SERVER_URL = 'https://my-shop-api-rgya.onrender.com';

const Cart = ({ cart, removeFromCart, clearCart, setView }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeCart = cart || [];
  const totalPrice = safeCart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      alert("Будь ласка, увійдіть в акаунт, щоб зробити замовлення!");
      if (setView) setView('login'); 
      return;
    }

    if (safeCart.length === 0) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${SERVER_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user._id || user.id,
          products: safeCart,
          totalPrice: totalPrice
        })
      });

      if (response.ok) {
        alert("Замовлення успішно оформлено! 🚀");
        if (clearCart) clearCart(); // Викликаємо очищення, якщо функція передана
        if (setView) setView('orders');
      } else {
        const errorData = await response.json();
        alert(`Помилка: ${errorData.message || "Не вдалося оформити"}`);
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

      {safeCart.length === 0 ? (
        <div className="text-center py-10">
            <p className="text-gray-400 text-xl mb-4">Кошик порожній 🛒</p>
            <p className="text-gray-500">Додайте товари, щоб побачити їх тут.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {safeCart.map((item, index) => (
              <div key={item._id || index} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-4">
                  {item.image ? (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-white rounded" />
                  ) : (
                      <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center text-xs">No img</div>
                  )}
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-green-400">${item.price}</p>
                  </div>
                </div>
                <button 
                  // 👇 Викликаємо функцію видалення, яку нам передали
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-400 hover:text-red-300 font-bold px-3 py-1 rounded hover:bg-red-900/30 transition"
                >
                  Видалити
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-600 pt-6 gap-4">
            <div className="text-2xl font-bold">Всього: <span className="text-green-400">${totalPrice.toFixed(2)}</span></div>
            <button 
              onClick={handleCheckout}
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition w-full md:w-auto ${
                  isSubmitting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/50'
              }`}
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