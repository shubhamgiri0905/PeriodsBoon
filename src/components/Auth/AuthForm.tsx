import React, { useState } from 'react';
import { Heart, Loader, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TutorialModal from '../Tutorial/TutorialModal';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  
  const { login, register, isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const success = await login(email, password);
        if (!success) {
          setError('Login failed. Please try again.');
        }
      } else {
        const success = await register(email, password, username);
        if (!success) {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-rose-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Welcome */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-2">Welcome to PeriodsBoon</h1>
          <p className="text-sage-600">Your supportive cycle companion</p>
        </div>
        
        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-sage-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-sage-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required={!isLogin}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all bg-white/50"
                  placeholder="Choose a username"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all bg-white/50"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-sage-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all bg-white/50"
                placeholder="••••••••"
              />
            </div>
            
            {error && (
              <div className="text-rose-600 text-sm text-center bg-rose-50 py-2 px-4 rounded-lg">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-sage-500 to-sage-600 text-white py-3 px-4 rounded-xl font-medium hover:from-sage-600 hover:to-sage-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sage-600 hover:text-sage-800 font-medium transition-colors"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
        
        {/* Privacy Note */}
        <div className="text-center text-sm text-sage-500">
          <p>Your privacy is our priority. All data is stored securely.</p>
          <button 
            onClick={() => setShowTutorial(true)}
            className="mt-2 text-sage-600 hover:text-sage-800 font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Learn about PeriodsBoon</span>
          </button>
        </div>
        
        {/* Tutorial Modal */}
        <TutorialModal 
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
        />
      </div>
    </div>
  );
};

export default AuthForm;