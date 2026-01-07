import { useEffect, useState } from 'react';
import ProductCard from './components/Product';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Orders from './components/Orders';
import './App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SERVER_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://my-shop-api-rgya.onrender.com';

const MOCK_PRODUCTS = [
  {
    asin: 'MOCK_001',
    product_title: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium',
    product_price: '$1,199.00',
    product_photo: 'https://m.media-amazon.com/images/I/81vxWpPpgpL._AC_SX679_.jpg',
    product_star_rating: '4.6',
    product_num_ratings: '3500'
  },
  {
    asin: 'MOCK_002',
    product_title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    product_price: '$348.00',
    product_photo: 'https://m.media-amazon.com/images/I/61+El684QwL._AC_SX679_.jpg',
    product_star_rating: '4.5',
    product_num_ratings: '12500'
  },
  {
    asin: 'MOCK_003',
    product_title: 'PlayStation 5 Console (PS5) - Slim Edition',
    product_price: '$499.00',
    product_photo: 'https://m.media-amazon.com/images/I/51051FiD9UL._SX522_.jpg',
    product_star_rating: '4.8',
    product_num_ratings: '45000'
  },
  {
    asin: 'MOCK_004',
    product_title: 'Samsung Galaxy S24 Ultra 5G AI Smartphone',
    product_price: '$1,299.00',
    product_photo: 'https://m.media-amazon.com/images/I/71cx-eL80HL._AC_SX679_.jpg',
    product_star_rating: '4.7',
    product_num_ratings: '2100'
  },
  {
    asin: 'MOCK_005',
    product_title: 'DJI Mini 4 Pro (DJI RC 2) - Mini Drone',
    product_price: '$959.00',
    product_photo: 'https://m.media-amazon.com/images/I/61OrK5jtH5L._AC_SX679_.jpg',
    product_star_rating: '4.9',
    product_num_ratings: '850'
  }
];

const MOCK_REVIEWS = [
  {
    review_id: 'mock_r1',
    review_author: 'TechEnthusiast USA',
    review_star_rating: '5',
    review_date: 'December 15, 2025',
    review_title: 'Absolutely amazing value!',
    review_comment: 'I was skeptical at first, but this product exceeded my expectations. The build quality is top-notch and it arrived faster than expected. Highly recommend!'
  },
  {
    review_id: 'mock_r2',
    review_author: 'Sarah Jenkins',
    review_star_rating: '4',
    review_date: 'January 3, 2026',
    review_title: 'Good, but could be better',
    review_comment: 'Works as advertised. Setup was easy, but I wish the battery life was a bit longer. Still a great purchase for the price.'
  },
  {
    review_id: 'mock_r3',
    review_author: 'Michael R.',
    review_star_rating: '5',
    review_date: 'November 20, 2025',
    review_title: 'Perfect gift',
    review_comment: 'Bought this for my son and he loves it. Works perfectly out of the box.'
  }
];

const searchAmazonProducts = async (query, page = 1) => {
  const options = {
    method: 'GET',
    url: 'https://api.openwebninja.com/realtime-amazon-data/search',
    params: {
      query: query,
      page: page.toString(),
      country: 'US',
      sort_by: 'RELEVANCE',
      product_condition: 'ALL'
    },
    headers: {
      'x-api-key': ''
    }
  };

  try {
    const response = await axios.request(options);
    const data = response.data.data.products || [];

    if (data.length === 0) {
      console.warn("API нічого не знайшов, перемикаюсь на демо");
      return MOCK_PRODUCTS;
    }
    return data;

  } catch (error) {
    console.error("Помилка нового API:", error);
    toast.warning("API помилка. Показано демо-товари 🛠️");
    return MOCK_PRODUCTS;
  }
};

const getProxyImage = (url) => {
  if (!url) return 'https://via.placeholder.com/300?text=No+Image';
  if (url.includes('weserv.nl') || !url.startsWith('http')) return url;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&il&w=600&output=webp`;
};

const getPriceValue = (priceStr) => {
  if (!priceStr) return 0;
  return parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 0;
};


function App() {
  const [cart, setCart] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('electronics');
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('Всі');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('relevance');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState('shop');
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [amazonReviews, setAmazonReviews] = useState([]);

  const brands = ['Всі', 'Samsung', 'LG', 'Bosch', 'Dyson', 'Apple'];

  const handleAddToCart = (product) => {
    const newProduct = {
      _id: product._id,
      name: product.name,
      image: getProxyImage(product.image),
      price: getPriceValue(product.price),
      brand: 'Amazon Product'
    };
    
    setCart(prev => [...prev, newProduct]);

    toast.success('Товар додано в кошик! 🛒', {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark",
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const formatProducts = (apiData) => {
    return apiData.map(item => ({
      _id: item.asin,
      name: item.product_title,
      price: item.product_price,
      image: item.product_photo,
      rating: item.product_star_rating,
      numReviews: item.product_num_ratings,
      isApiProduct: true,
      originalData: item
    }));
  };

  const loadProducts = async () => {
    setLoading(true);
    const apiResults = await searchAmazonProducts(currentSearchTerm, currentPage);
    const formatted = formatProducts(apiResults);
    setProducts(formatted);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchComments = async (productId) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/comments/${productId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Не вдалося завантажити коментарі", error);
    }
  };

 const getAmazonReviews = async (asin) => {
    console.log("🔍 Перевіряємо ASIN:", asin); 

    if (asin.startsWith('MOCK_')) {
      console.log("⚠️ Це тестовий товар, показуємо заглушки.");
      return MOCK_REVIEWS;
    }

    try {
      console.log("🚀 Це справжній товар! Відправляю запит на сервер..."); 
      const response = await axios.get(`${SERVER_URL}/api/amazon-reviews/${asin}`);
      console.log("✅ Сервер відповів:", response.data);
      
      const reviews = response.data || [];
      if (reviews.length === 0) return MOCK_REVIEWS;
      return reviews;

    } catch (error) {
      console.error("❌ Помилка сервера:", error);
      return MOCK_REVIEWS;
    }
  };
  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setSearchQuery('');
    setCurrentPage(1);

    if (brand === 'Всі') {
      setCurrentSearchTerm('electronics');
    } else {
      setCurrentSearchTerm(`${brand} electronics`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSelectedBrand('Всі');
    setCurrentPage(1);
    setCurrentSearchTerm(`${searchQuery} electronics`);
  };

  const changePage = (newPage) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sortedProducts = [...products];
    switch (option) {
      case 'price-asc': sortedProducts.sort((a, b) => getPriceValue(a.price) - getPriceValue(b.price)); break;
      case 'price-desc': sortedProducts.sort((a, b) => getPriceValue(b.price) - getPriceValue(a.price)); break;
      case 'rating': sortedProducts.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0)); break;
      case 'reviews': sortedProducts.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0)); break;
      default: break;
    }
    setProducts(sortedProducts);
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setView('details');
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.find(item => item._id === product._id);
    if (exists) {
      setWishlist(prev => prev.filter(item => item._id !== product._id));
      toast.info("Видалено з обраного 💔");
    } else {
      setWishlist(prev => [...prev, product]);
      toast.success("Додано в обране ❤️");
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      await axios.post(`${SERVER_URL}/api/comments`, {
        productId: selectedProduct._id,
        userName: user ? (user.name || user.username || user.login || user.email) : 'Гість',
        text: newCommentText,
        rating: newRating
      });
      setNewCommentText('');
      setNewRating(5);
      toast.success('Коментар додано!');
      fetchComments(selectedProduct._id);
    } catch (error) {
      toast.error('Помилка при додаванні коментаря');
      console.error(error);
    }
  };

  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setView('shop');
    toast.success(`Вітаю, ${userData.name || 'користувач'}! 👋`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('shop');
    toast.info("Ви вийшли з акаунту");
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Видалити цей відгук?")) return;

    try {
      await axios.delete(`${SERVER_URL}/api/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Відгук видалено! 🗑️");
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося видалити відгук");
    }
  };

  // --- ЕФЕКТИ ---

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (view === 'shop') {
      loadProducts();
    }
  }, [currentPage, currentSearchTerm, view]);

  useEffect(() => {
    if (view === 'details' && selectedProduct) {
      fetchComments(selectedProduct._id);

      if (selectedProduct.isApiProduct) {
        setLoadingReviews(true);
        getAmazonReviews(selectedProduct._id).then(reviews => {
          setAmazonReviews(reviews);
          setLoadingReviews(false);
        });
      } else {
        setAmazonReviews([]);
      }
    }
  }, [view, selectedProduct]);


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <ToastContainer />
      {/* 👇 Передаємо cart.length у Header, щоб показувати кількість товарів */}
      <Header user={user} onLogout={handleLogout} setView={setView} currentView={view} cartCount={cart.length} />

      <main className="flex-grow w-full px-4 py-6">

        {view === 'shop' && (
          <div className="max-w-7xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-4xl mx-auto">
              <input
                type="text"
                placeholder="Введіть назву товару (напр. iPhone 15)..."
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">Знайти</button>
              {products.length > 0 && (
                <button type="button" onClick={() => handleBrandClick('Всі')} className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600">Скинути</button>
              )}
            </form>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-800/50 p-4 rounded-xl">
              <div className="flex flex-wrap justify-center gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandClick(brand)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${selectedBrand === brand ? 'bg-blue-600 text-white shadow-blue-500/50' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm hidden md:inline">Сортувати:</span>
                <select value={sortOption} onChange={(e) => handleSort(e.target.value)} className="bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 focus:border-blue-500 cursor-pointer text-sm">
                  <option value="relevance">Релевантність</option>
                  <option value="price-asc">Ціна: Дешеві → Дорогі</option>
                  <option value="price-desc">Ціна: Дорогі → Дешеві</option>
                  <option value="rating">Рейтинг: Високий → Низький</option>
                  <option value="reviews">Популярність (відгуки)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {view === 'register' && <Register />}
        {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
        
        {view === 'cart' && (
          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            setView={setView}
          />
        )}
        
        {view === 'wishlist' && <Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} setView={setView} onProductClick={openProductDetails} />}
        {view === 'orders' && <Orders setView={setView} />}

        {view === 'details' && selectedProduct && (
          <div className="max-w-6xl mx-auto mt-4">

            <div className="bg-gray-800 rounded-xl p-8 shadow-2xl mb-8">
              <button onClick={() => setView('shop')} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition">← Назад до каталогу</button>
              <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-1/2 bg-white rounded-xl p-6 flex items-center justify-center overflow-hidden relative">
                  <button
                    onClick={() => toggleWishlist(selectedProduct)}
                    className="absolute top-4 right-4 p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition text-2xl shadow-md z-10"
                    title="Додати в обране"
                  >
                    {wishlist.some(i => i._id === selectedProduct._id) ? '❤️' : '🤍'}
                  </button>
                  <img src={getProxyImage(selectedProduct.image)} alt={selectedProduct.name} className="max-h-[400px] object-contain hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="md:w-1/2 flex flex-col justify-center">
                  <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{selectedProduct.name}</h1>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-3xl text-green-400 font-bold">
                      {!String(selectedProduct.price).includes('$') && '$'}
                      {selectedProduct.price}
                    </div>
                    {selectedProduct.isApiProduct && (
                      <div className="bg-yellow-600/20 text-yellow-400 border border-yellow-600 px-3 py-1 rounded-lg text-sm font-semibold">★ {selectedProduct.rating} ({selectedProduct.numReviews} відгуків)</div>
                    )}
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg mb-8">
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">{selectedProduct.description || selectedProduct.name}<br /><br />Це оригінальний товар з каталогу Amazon (US). Доставка може займати певний час.</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAddToCart(selectedProduct)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-bold text-lg transition shadow-lg shadow-green-900/20"
                    >
                      Додати в кошик
                    </button>
                    {selectedProduct.originalData && selectedProduct.originalData.product_url && (
                      <a
                        href={selectedProduct.originalData.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition flex items-center"
                      >
                        На Amazon ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">💬 Відгуки користувачів</h2>

              <form onSubmit={handlePostComment} className="mb-8 bg-gray-700/30 p-6 rounded-xl border border-gray-700">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 font-medium">Ваша оцінка:</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`text-2xl transition-transform hover:scale-110 ${star <= newRating ? 'text-yellow-400' : 'text-gray-600'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block text-gray-300 mb-2 font-medium">Залишити свій відгук:</label>
                <textarea
                  className="w-full p-4 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500 mb-3 min-h-[100px]"
                  placeholder="Напишіть, що ви думаєте про цей товар..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                ></textarea>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-900/20">
                  Надіслати відгук
                </button>
              </form>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-white font-semibold mb-4 border-l-4 border-blue-500 pl-3">Відгуки клієнтів TechnoSvit</h3>
                  <div className="space-y-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment._id} className="bg-gray-900 p-4 rounded-xl border border-gray-700/50 shadow-sm relative group">
                          {user && (
                            (user.name || user.username || user.login || user.email) === comment.userName
                          ) && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                                title="Видалити відгук"
                              >
                                🗑️
                              </button>
                            )}
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-bold text-blue-400 text-lg">{comment.userName}</div>
                              <div className="flex text-yellow-400 text-sm mt-1">
                                {'★'.repeat(comment.rating || 5)}
                                <span className="text-gray-600">{'★'.repeat(5 - (comment.rating || 5))}</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 font-mono bg-gray-800 px-2 py-1 mr-6 rounded">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-gray-300 mt-2">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Поки що немає локальних відгуків. Будьте першим!</p>
                    )}
                  </div>
                </div>

                {selectedProduct.isApiProduct && (
                  <div>
                    <h3 className="text-xl text-white font-semibold mb-4 border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
                      Відгуки з Amazon <span className="text-xs bg-yellow-600/20 text-yellow-500 px-2 py-0.5 rounded border border-yellow-600/50">Verified Purchase</span>
                    </h3>

                    {loadingReviews ? (
                      <div className="text-gray-400 animate-pulse py-4">Завантаження відгуків з Amazon...</div>
                    ) : amazonReviews.length > 0 ? (
                      <div className="space-y-4">
                        {amazonReviews.map((review, index) => (
                          <div key={review.review_id || index} className="bg-gray-900 p-4 rounded-xl border border-gray-700/50 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex flex-col">
                                <span className="font-bold text-blue-400 text-lg">{review.review_author}</span>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-yellow-400 text-sm tracking-wide">
                                    {'★'.repeat(parseInt(review.review_star_rating) || 0)}
                                    <span className="text-gray-600">{'★'.repeat(5 - (parseInt(review.review_star_rating) || 0))}</span>
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 font-mono bg-gray-800 px-2 py-1 rounded">
                                {review.review_date}
                              </div>
                            </div>
                            {review.review_title && (
                              <h4 className="font-bold text-white mb-2 text-base">{review.review_title}</h4>
                            )}
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                              {review.review_comment}
                            </p>
                            {review.review_link && (
                              <div className="mt-3 pt-3 border-t border-gray-800">
                                <a href={review.review_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-400 hover:underline flex items-center gap-1 transition-colors">
                                  Читати оригінал на Amazon ↗
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-800 rounded-lg text-gray-400 text-sm border border-gray-700">
                        Не вдалося знайти відгуки на Amazon для цього товару або вони відсутні.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'shop' && (
          <div className="flex flex-col w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {loading ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-xl">Завантажую сторінку {currentPage}...</p>
                </div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div key={product._id} onClick={() => openProductDetails(product)} className="cursor-pointer transform hover:-translate-y-1 transition-transform duration-300">
                    <ProductCard
                      product={product}
                      isLiked={wishlist.some(item => item._id === product._id)}
                      onToggleLike={() => toggleWishlist(product)}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center w-full col-span-full py-20 text-gray-500 text-lg">
                  {selectedBrand === 'Всі' && currentPage === 1 ? 'Введіть назву товару або оберіть бренд' : 'Товарів не знайдено'}
                </div>
              )}
            </div>

            {products.length > 0 && !loading && (
              <div className="flex justify-center items-center gap-6 mt-12 mb-8">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-6 py-3 rounded-lg font-bold transition flex items-center gap-2 ${currentPage === 1 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                >
                  ← Назад
                </button>

                <span className="text-xl font-mono text-blue-400 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  Сторінка {currentPage}
                </span>

                <button
                  onClick={() => changePage(currentPage + 1)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition flex items-center gap-2"
                >
                  Далі →
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;