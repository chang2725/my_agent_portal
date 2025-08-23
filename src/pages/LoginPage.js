import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (!userId.trim() || !password.trim()) {
        setErrorMessage('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/agent/login`, { email: userId, password });

      if (res.data.status === 200) {
        const { id, name } = res.data.data;
        localStorage.setItem('agent', JSON.stringify({ id, name }));
        login({ id, name }); 
        navigate('/dashboard');
      } else {
        setErrorMessage(res.data.message || 'Invalid Credentials');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) setErrorMessage('Invalid credentials. Please try again.');
        else if (err.response.status === 500) setErrorMessage('Server error. Please try again later.');
        else setErrorMessage('An unexpected error occurred. Please try again.');
        } else if (err.request) {
        setErrorMessage('Network error. Please check your connection.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Agent Portal</h1>
            <p className="text-purple-200 mt-1">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="p-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="/" className="font-medium text-purple-600 hover:text-purple-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${
                    isLoading
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                  } transition-all duration-200`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="bg-gray-50 px-8 py-4 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Agent Portal. All rights reserved.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 bg-white/50 backdrop-blur-sm p-4 rounded-xl">
          <p className="font-medium">Demo Credentials</p>
          <p className="mt-1">Email: changvijay54@gmail.com</p>
          <p>Password: Vijay@1231</p>
        </div>
      </div>
    </div>
  );
}
