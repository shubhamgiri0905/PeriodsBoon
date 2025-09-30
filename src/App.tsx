import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/Auth/AuthForm';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import SettingsModal from './components/Layout/SettingsModal';
import PastPeriodsModal from './components/Dashboard/PastPeriodsModal';
import TutorialModal from './components/Tutorial/TutorialModal';
import TodayView from './components/Dashboard/TodayView';
import CalendarView from './components/Calendar/CalendarView';
import InsightsView from './components/Insights/InsightsView';
import JournalView from './components/Journal/JournalView';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showPastPeriods, setShowPastPeriods] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <p className="text-sage-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <AuthForm />;
  }
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TodayView />;
      case 'calendar':
        return <CalendarView />;
      case 'insights':
        return <InsightsView />;
      case 'journal':
        return <JournalView />;
      default:
        return <TodayView />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-rose-50">
      <Header onSettingsClick={() => setShowSettings(true)} />
      <main className="pb-20">
        {renderActiveTab()}
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Modals */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        onShowTutorial={() => {
          setShowSettings(false);
          setShowTutorial(true);
        }}
        onShowPastPeriods={() => {
          setShowSettings(false);
          setShowPastPeriods(true);
        }}
      />
      
      <PastPeriodsModal 
        isOpen={showPastPeriods}
        onClose={() => setShowPastPeriods(false)}
      />
      
      <TutorialModal 
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;