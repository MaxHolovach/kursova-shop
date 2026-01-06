import { useState } from 'react';

const Register = () => {
  // Стан для даних форми
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Стан для повідомлень (успіх або помилка)
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Функція, яка оновлює стан при введенні тексту
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Функція відправки форми на сервер
  const handleSubmit = async (e) => {
    e.preventDefault(); // Щоб сторінка не перезавантажувалась
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Успішна реєстрація! Тепер ви можете увійти.');
        setFormData({ username: '', email: '', password: '' }); // Очистити поля
      } else {
        setError(data.message || 'Щось пішло не так');
      }
    } catch (err) {
      setError('Помилка з\'єднання з сервером');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Реєстрація</h2>

      {/* Повідомлення про успіх або помилку */}
      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ім'я */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Ім'я користувача</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Пароль */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Зареєструватися
        </button>
      </form>
    </div>
  );
};

export default Register;