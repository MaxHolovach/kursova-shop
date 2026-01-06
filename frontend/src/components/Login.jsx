import { useState } from 'react';

const SERVER_URL = 'https://my-shop-api-rgya.onrender.com';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.message || 'Помилка входу');
      }
    } catch (err) {
      setError('Помилка з\'єднання');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-gray-800 p-8 border border-gray-700 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Вхід в акаунт</h2>
      
      {error && <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded border border-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Пароль</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Увійти
        </button>
      </form>
    </div>
  );
};

export default Login;