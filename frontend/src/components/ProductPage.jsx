import { useLocation, useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { product } = location.state || {};

  if (!product) {
    return <div className="text-white text-center mt-10">Товар не знайдено. Поверніться до пошуку.</div>;
  }

  return (
    <div className="container mx-auto p-6 text-white">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 text-gray-400 hover:text-white"
      >
        ← Назад до результатів
      </button>

      <div className="bg-gray-800 rounded-xl p-8 flex flex-col md:flex-row gap-10 shadow-lg">
        <div className="md:w-1/2 bg-white rounded-lg p-4 flex items-center justify-center">
          <img 
            src={product.product_photo} 
            alt={product.product_title} 
            className="max-h-[400px] object-contain" 
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">{product.product_title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl text-green-400 font-bold">{product.product_price}</span>
            <span className="bg-yellow-600 px-3 py-1 rounded text-sm">
              Рейтинг: {product.product_star_rating || 'N/A'} ★
            </span>
          </div>

          <p className="text-gray-400 mb-8">
            Код товару (ASIN): {product.asin}<br/>
            Відгуків: {product.product_num_ratings}
          </p>

          <div className="flex gap-4">
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition">
              Купити зараз
            </button>
            <a 
              href={product.product_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 border border-gray-500 text-center py-3 px-6 rounded-lg hover:bg-gray-700 transition"
            >
              Дивитись на Amazon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;