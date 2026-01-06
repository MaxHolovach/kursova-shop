import React from 'react';
import ProductCard from './Product'; // Перевір шлях, можливо './ProductCard' або './Product'
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

// Допоміжні функції (щоб не дублювати код, можна винести в utils.js, але поки залишимо тут)
const getProxyImage = (url) => {
    if (!url) return 'https://via.placeholder.com/300?text=No+Image';
    if (url.includes('weserv.nl') || !url.startsWith('http')) return url;
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&il&w=600&output=webp`;
};

const getPriceValue = (priceStr) => {
    if (!priceStr) return 0;
    return parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 0;
};

// 👇 Додаємо onProductClick в пропси
const Wishlist = ({ wishlist, toggleWishlist, setView, onProductClick }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
      addToCart({
          _id: product._id,
          name: product.name,
          image: getProxyImage(product.image), // Важливо: проксіюємо картинку для кошика
          price: getPriceValue(product.price),
          brand: 'Amazon Product'
      });
      toast.success('Товар додано в кошик! 🛒', { theme: "dark" });
  };
  
  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-gray-300 mb-4">Список бажань порожній 💔</h2>
        <p className="text-gray-400 mb-8">Ви ще нічого не вподобали.</p>
        <button 
          onClick={() => setView('shop')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
        >
          Перейти до товарів
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Ваше обране ❤️</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          // 👇 Додаємо обгортку з onClick для переходу на сторінку товару
          <div 
             key={product._id} 
             className="relative cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
             onClick={() => onProductClick(product)}
          >
             <ProductCard 
                product={product} 
                isLiked={true} 
                onToggleLike={() => toggleWishlist(product)}
                onAddToCart={() => handleAddToCart(product)} // Передаємо функцію
             />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;