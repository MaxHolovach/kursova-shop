import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_KEY = 'ak_6q3ze0sznehrbk5y09zlm1kxhrxpro8tgs0at43cj0ym5u3';

const SERVER_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://my-shop-api-rgya.onrender.com';

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  const [amazonReviews, setAmazonReviews] = useState([]);
  const [localReviews, setLocalReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (product?.asin) {
      fetchLocalReviews();
      fetchAmazonReviews();
    }
  }, [product]);

  const fetchLocalReviews = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/comments/${product.asin}`);
      if (res.ok) {
        const data = await res.json();
        setLocalReviews(data);
      }
    } catch (error) {
      console.error("Помилка завантаження локальних коментарів", error);
    }
  };

  const fetchAmazonReviews = async () => {
    setLoadingReviews(true);
    try {
      const fields = 'review_title,review_comment,review_star_rating,review_author,review_date';
      const url = `https://api.openwebninja.com/realtime-amazon-data/product-reviews?asin=${product.asin}&country=US&page=1&sort_by=TOP_REVIEWS&fields=${fields}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY
        }
      });

      const data = await response.json();
      
      const reviews = data.data?.reviews || []; 
      setAmazonReviews(reviews);

    } catch (error) {
      console.error("Не вдалося завантажити відгуки Amazon", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Увійдіть, щоб залишити коментар!");
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${SERVER_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asin: product.asin,
          userId: user._id || user.id,
          username: user.name || user.username || "Користувач",
          text: newComment
        })
      });

      if (res.ok) {
        setNewComment('');
        fetchLocalReviews();
      }
    } catch (error) {
      alert("Помилка при відправці");
    }
  };

  if (!product) return <div className="text-white text-center mt-10">Товар не знайдено.</div>;

  return (
    <div className="container mx-auto p-6 text-white">
      <button onClick={() => navigate(-1)} className="mb-4 text-gray-400 hover:text-white">← Назад</button>

      <div className="bg-gray-800 rounded-xl p-8 flex flex-col md:flex-row gap-10 shadow-lg mb-8">
        <div className="md:w-1/2 bg-white rounded-lg p-4 flex items-center justify-center">
            <img src={product.product_photo} alt={product.product_title} className="max-h-[400px] object-contain" />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4">{product.product_title}</h1>
            <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl text-green-400 font-bold">{product.product_price}</span>
                <span className="bg-yellow-600 px-3 py-1 rounded text-sm">Amazon: {product.product_star_rating} ★</span>
            </div>
            <a href={product.product_url} target="_blank" className="bg-green-600 text-center py-3 rounded hover:bg-green-500 font-bold block w-full md:w-auto px-6">Купити на Amazon</a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        <div className="bg-gray-800 p-6 rounded-xl h-[600px] flex flex-col">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">💬 Чат спільноти</h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                {localReviews.length === 0 && <p className="text-gray-500 text-center mt-10">Напишіть перший відгук!</p>}
                {localReviews.map((review) => (
                    <div key={review._id} className="bg-gray-700 p-3 rounded border border-gray-600">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-blue-300">{review.username}</span>
                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm">{review.text}</p>
                    </div>
                ))}
            </div>

            {user ? (
                <form onSubmit={handleCommentSubmit} className="mt-auto">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                            placeholder="Ваш коментар..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-600 px-6 rounded hover:bg-blue-500 font-bold">➤</button>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-700 p-3 rounded text-center text-sm text-gray-400">
                    Увійдіть, щоб писати
                </div>
            )}
        </div>

        <div className="bg-gray-800 p-6 rounded-xl h-[600px] flex flex-col">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2 flex justify-between items-center">
                <span>⭐ Відгуки Amazon</span>
                {loadingReviews && <span className="text-sm text-yellow-400 animate-pulse">Завантаження...</span>}
            </h3>

            <div className="overflow-y-auto space-y-4 pr-2">
                {!loadingReviews && amazonReviews.length === 0 && (
                    <p className="text-gray-500 text-center mt-10">Відгуків з Amazon не знайдено або помилка доступу.</p>
                )}
                
                {amazonReviews.map((review, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-yellow-400">{review.review_star_rating} ★</span>
                            <span className="font-bold text-sm text-gray-300">{review.review_author}</span>
                        </div>
                        <h4 className="font-bold text-sm mb-1 text-white">{review.review_title}</h4>
                        <p className="text-gray-300 text-sm">{review.review_comment}</p>
                        <span className="text-xs text-gray-500 mt-2 block">{review.review_date}</span>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;