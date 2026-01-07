import { useState } from 'react';

const SERVER_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://my-shop-api-rgya.onrender.com';

const Cart = ({ cart, removeFromCart, clearCart, setView }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    shippingAddress: ''
  });

  const safeCart = cart || [];
  const totalPrice = safeCart.reduce((acc, item) => acc + item.price, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      alert("Будь ласка, увійдіть в акаунт!");
      if (setView) setView('login'); 
      return;
    }

    if (safeCart.length === 0) return;

    if (!formData.recipientName || !formData.phone || !formData.shippingAddress) {
        alert("Будь ласка, заповніть всі поля доставки! 📝");
        return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${SERVER_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id || user.id,
          products: safeCart,
          totalPrice: totalPrice,
          recipientName: formData.recipientName,
          phone: formData.phone,
          shippingAddress: formData.shippingAddress
        })
      });

      if (response.ok) {
        alert("Замовлення успішно оформлено! 🚀");
        if (clearCart) clearCart();
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
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="flex-1 space-y-4">
            {safeCart.map((item, index) => (
              <div key={item._id || index} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg border border-gray-600">
                <div className="flex items-center gap-3">
                  {item.image ? (
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-white rounded" />
                  ) : (
                      <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center text-xs">No img</div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-green-400 text-sm">${item.price}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-400 hover:text-red-300 text-sm font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>
            ))}
            <div className="text-xl font-bold text-right pt-2 border-t border-gray-600">
                Всього: <span className="text-green-400">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="md:w-1/3 bg-gray-700 p-6 rounded-xl border border-gray-600 h-fit">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🚚 Доставка</h3>
            <form onSubmit={handleCheckout} className="space-y-4">
                
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Ім'я отримувача</label>
                    <input 
                        type="text" 
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleChange}
                        placeholder="Іван Іванов"
                        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:border-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Номер телефону</label>
                    <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+380..."
                        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:border-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Адреса доставки</label>
                    <textarea 
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        placeholder="Місто, вулиця, відділення пошти..."
                        rows="3"
                        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:border-blue-500 outline-none resize-none"
                    ></textarea>
                </div>

                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg font-bold text-lg transition shadow-lg mt-2 ${
                        isSubmitting 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-500 shadow-green-900/50'
                    }`}
                >
                    {isSubmitting ? 'Обробка...' : 'Підтвердити замовлення'}
                </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;