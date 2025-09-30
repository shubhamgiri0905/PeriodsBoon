import React from 'react';
import { Calendar, Heart, BookOpen, BarChart3 } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Today', icon: Heart },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'journal', label: 'Journal', icon: BookOpen },
  ];
  
  return (
    <nav className="bg-white border-t border-sage-200 px-4 py-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-sage-100 text-sage-800'
                  : 'text-sage-500 hover:text-sage-700 hover:bg-sage-50'
              }`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;