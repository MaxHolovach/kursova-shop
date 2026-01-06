import React, { useState } from 'react';

// 👇 Додаємо onAddToCart в пропси
const Product = ({ product, isLiked, onToggleLike, onAddToCart }) => {
    const [imgSrc, setImgSrc] = useState(null);

    const getProxyImage = (url) => {
        if (!url) return 'https://via.placeholder.com/300?text=No+Image';
        if (url.includes('weserv.nl') || !url.startsWith('http')) return url;
        return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&il&w=400&output=webp`;
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full relative shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            
            <button 
                onClick={(e) => {
                    e.stopPropagation(); 
                    onToggleLike();
                }}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-gray-900/50 hover:bg-gray-700 transition backdrop-blur-sm"
                title={isLiked ? "Видалити з бажаного" : "Додати в бажане"}
            >
                {isLiked ? '❤️' : '🤍'}
            </button>

            <div className="h-48 bg-white rounded flex items-center justify-center mb-4 p-2 overflow-hidden relative">
                <img 
                    src={imgSrc || getProxyImage(product.image)} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.onerror = null; 
                        setImgSrc('https://via.placeholder.com/300?text=No+Image');
                    }}
                />
            </div>

            <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight line-clamp-2" title={product.name}>
                    {product.name}
                </h3>

                {product.isApiProduct && (
                    <div className="text-sm text-yellow-400 mb-2">
                        ★ {product.rating} <span className="text-gray-500">({product.numReviews})</span>
                    </div>
                )}

                <div className="mt-auto flex justify-between items-center pt-4">
    <span className="text-xl font-bold text-green-400">
        {!String(product.price).includes('$') && '$'}
        {product.price}
    </span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Зупиняємо спливання події (щоб не відкривалась сторінка товару)
                            if (onAddToCart) onAddToCart(); // Викликаємо функцію додавання
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors z-20 relative"
                    >
                        Купити
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product;