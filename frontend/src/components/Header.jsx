import React from 'react';
import { useCart } from '../context/CartContext';

const Header = ({ user, onLogout, setView, currentView }) => {
  const { cartItems } = useCart();
  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700">
      <div className="w-full px-8 h-16 flex items-center justify-between">
        <div
          className="text-2xl font-bold text-white cursor-pointer flex items-center gap-2"
          onClick={() => setView('shop')}
        >
          <span className="text-blue-500">⚡</span> ТехноСвіт
        </div>

        <nav className="flex items-center gap-6">
          <button onClick={() => setView('shop')} className={`font-medium transition ${currentView === 'shop' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
            Товари
          </button>

          <button
            onClick={() => setView('wishlist')}
            className={`hover:text-red-400 transition ${currentView === 'wishlist' ? 'text-red-500' : ''}`}
            title="Список бажань"
          >
            ❤️ Обране
          </button>

          <button
            onClick={() => setView('orders')}
            className={`hover:text-yellow-400 transition ${currentView === 'orders' ? 'text-yellow-500' : ''}`}
          >
            📦 Замовлення
          </button>

          <button
            onClick={() => setView('cart')}
            className={`relative flex items-center gap-1 font-medium transition ${currentView === 'cart' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
          >
            {/* SVG іконка кошика */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>

            {/* Лічильник (червоний кружечок) */}
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>

          {user ? (
            // ВАРІАНТ ДЛЯ ЗАЛОГІНЕНОГО КОРИСТУВАЧА
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 hidden sm:block">
                Привіт, <span className="font-bold text-white">{user.username}</span>
              </span>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition"
              >
                Вийти
              </button>
            </div>
          ) : (
            // ВАРІАНТ ДЛЯ ГОСТЯ
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('login')}
                className={`px-4 py-2 text-sm rounded-md transition ${currentView === 'login' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                Вхід
              </button>
              <button
                onClick={() => setView('register')}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
              >
                Реєстрація
              </button>
            </div>
          )}
        </nav>

      </div>
    </header>
  );
};

export default Header;