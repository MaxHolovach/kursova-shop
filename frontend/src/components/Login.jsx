import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const SERVER_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://my-shop-api-rgya.onrender.com';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert(data.message || 'Помилка входу');
      }
    } catch (error) {
      alert('Помилка з\'єднання');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.token, data.user);
      } else {
        alert("Помилка авторизації Google");
      }
    } catch (error) {
      console.error(error);
      alert("Не вдалося з'єднатися з сервером");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-gray-800 p-8 rounded-xl shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Вхід</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-400 mb-1">Email</label>
          <input type="email" name="email" onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none text-white" required />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Пароль</label>
          <input type="password" name="password" onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none text-white" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition">Увійти</button>
      </form>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400">або</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>

      <div className="flex justify-center mt-4">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log('Login Failed')}
          theme="filled_black"
          shape="pill"
          width="100%"
        />
      </div>
    </div>
  );
};

export default Login;