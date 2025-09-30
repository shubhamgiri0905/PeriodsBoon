import React, { useState } from 'react';
import { X, User, Bell, Shield, HelpCircle, Calendar, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowTutorial: () => void;
  onShowPastPeriods: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onShowTutorial, 
  onShowPastPeriods 
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-200">
          <h2 className="text-xl font-semibold text-sage-800">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-sage-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-sage-600" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 bg-sage-50 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-sage-500 text-white'
                      : 'text-sage-700 hover:bg-sage-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 max-h-[70vh] overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-sage-800 mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={user?.username || ''}
                        readOnly
                        className="w-full px-4 py-3 border border-sage-300 rounded-xl bg-sage-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="w-full px-4 py-3 border border-sage-300 rounded-xl bg-sage-50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-sage-800 mb-4">Cycle Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Average Cycle Length
                        <button className="ml-1 text-sage-400 hover:text-sage-600">
                          <Info className="w-3 h-3 inline" />
                        </button>
                      </label>
                      <input
                        type="number"
                        value={user?.avgCycleLength || 28}
                        min="21"
                        max="35"
                        className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Average Period Length
                        <button className="ml-1 text-sage-400 hover:text-sage-600">
                          <Info className="w-3 h-3 inline" />
                        </button>
                      </label>
                      <input
                        type="number"
                        value={user?.avgPeriodLength || 5}
                        min="3"
                        max="8"
                        className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-sage-800 mb-4">Data Management</h3>
                  <div className="space-y-3">
                    <button
                      onClick={onShowPastPeriods}
                      className="w-full flex items-center justify-between p-4 border border-sage-300 rounded-xl hover:bg-sage-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-sage-600" />
                        <div className="text-left">
                          <p className="font-medium text-sage-800">Log Past Periods</p>
                          <p className="text-sm text-sage-600">Add historical cycle data</p>
                        </div>
                      </div>
                      <span className="text-sage-400">→</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-sage-200">
                  <button
                    onClick={logout}
                    className="w-full bg-rose-500 text-white py-3 px-4 rounded-xl hover:bg-rose-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-sage-800">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-sage-300 rounded-xl">
                    <div>
                      <p className="font-medium text-sage-800">Period Reminders</p>
                      <p className="text-sm text-sage-600">Get notified before your period starts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-sage-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-sage-300 rounded-xl">
                    <div>
                      <p className="font-medium text-sage-800">Logging Reminders</p>
                      <p className="text-sm text-sage-600">Daily reminders to log symptoms</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-sage-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-sage-800">Privacy & Security</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-sage-50 rounded-xl">
                    <h4 className="font-medium text-sage-800 mb-2">Data Storage</h4>
                    <p className="text-sm text-sage-600">
                      Your data is stored locally on your device for maximum privacy. 
                      We never share your personal information with third parties.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-sage-50 rounded-xl">
                    <h4 className="font-medium text-sage-800 mb-2">Data Export</h4>
                    <p className="text-sm text-sage-600 mb-3">
                      You can export your data at any time in a standard format.
                    </p>
                    <button className="text-sage-600 hover:text-sage-800 text-sm font-medium">
                      Export My Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-sage-800">Help & Support</h3>
                <div className="space-y-3">
                  <button
                    onClick={onShowTutorial}
                    className="w-full flex items-center justify-between p-4 border border-sage-300 rounded-xl hover:bg-sage-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="w-5 h-5 text-sage-600" />
                      <div className="text-left">
                        <p className="font-medium text-sage-800">App Tutorial</p>
                        <p className="text-sm text-sage-600">Learn how to use PeriodsBoon effectively</p>
                      </div>
                    </div>
                    <span className="text-sage-400">→</span>
                  </button>
                  
                  <div className="p-4 border border-sage-300 rounded-xl">
                    <h4 className="font-medium text-sage-800 mb-2">Contact Support</h4>
                    <p className="text-sm text-sage-600 mb-3">
                      Have questions or need help? We're here for you.
                    </p>
                    <p className="text-sm text-sage-600">support@PeriodsBoon-app.com</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;