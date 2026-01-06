import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800 mt-auto">
      <div className="w-full px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        
        {/* Колонка 1: Про нас */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">ТехноСвіт</h3>
          <p>
            Найкращий магазин побутової техніки. 
            Ми пропонуємо якісні товари з офіційною гарантією.
          </p>
        </div>

        {/* Колонка 2: Навігація */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Клієнтам</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500 transition">Доставка та оплата</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Гарантія</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Повернення товару</a></li>
          </ul>
        </div>

        {/* Колонка 3: Контакти */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Контакти</h3>
          <ul className="space-y-2">
            <li>📍 м. Київ, вул. Політехнічна, 1</li>
            <li>📞 +38 (099) 123-45-67</li>
            <li>✉️ support@technosvit.ua</li>
          </ul>
        </div>

      </div>
      <div className="text-center mt-8 pt-8 border-t border-gray-800 text-xs">
        &copy; {new Date().getFullYear()} ТехноСвіт. Всі права захищено. Курсова робота.
      </div>
    </footer>
  );
};

export default Footer;