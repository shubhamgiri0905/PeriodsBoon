import React from 'react';
import { LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-rose-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">PB</span>
            </div>
            <h1 className="text-xl font-semibold text-sage-800">PeriodsBoon</h1>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-sage-600 hidden sm:block">
              Hello, {user?.username}
            </span>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={onSettingsClick}
                className="p-2 text-sage-600 hover:text-sage-800 hover:bg-sage-50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button 
                onClick={logout}
                className="p-2 text-sage-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;