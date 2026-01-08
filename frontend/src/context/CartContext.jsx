import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedNewCart = localStorage.getItem('technosvit_cart');
        if (savedNewCart) return JSON.parse(savedNewCart);

        const savedOldCart = localStorage.getItem('cart');
        return savedOldCart ? JSON.parse(savedOldCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('technosvit_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const productId = product.asin || product._id;
            const existingItem = prevItems.find(item => (item.asin || item._id) === productId);

            if (existingItem) {
                return prevItems.map(item =>
                    (item.asin || item._id) === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => (item.asin || item._id) !== id));
    };

    const clearCart = () => setCartItems([]);

    const totalPrice = cartItems.reduce((acc, item) => {
        let price = item.product_price || item.price || 0;
        if (typeof price === 'string') {
            price = parseFloat(price.replace(/[^0-9.]/g, ''));
        }
        return acc + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};