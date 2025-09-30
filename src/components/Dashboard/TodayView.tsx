import React, { useState, useEffect } from 'react';
import { Calendar, Droplets, Heart, Smile, Plus, CreditCard as Edit3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { calculatePredictions } from '../../utils/predictions';
import { getDailyInsight } from '../../utils/insights';
import { DailyLog, CycleData } from '../../types';
import LoggingModal from './LoggingModal';

const TodayView: React.FC = () => {
  const { user } = useAuth();
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [cycles, setCycles] = useState<CycleData[]>([]);
  const [showLoggingModal, setShowLoggingModal] = useState(false);
  const [dailyInsight, setDailyInsight] = useState<string>('');
  
  const today = new Date().toISOString().split('T')[0];
  
  useEffect(() => {
    if (!user) return;
    
    const log = storage.getDailyLog(user.id, today);
    const userCycles = storage.getCycles(user.id);
    const userLogs = storage.getDailyLogs(user.id);
    
    setTodayLog(log);
    setCycles(userCycles);
    
    // Get daily insight
    const insight = getDailyInsight(today, userLogs, userCycles);
    setDailyInsight(insight.message);
  }, [user, today]);
  
  const predictions = calculatePredictions(cycles, storage.getDailyLogs(user?.id || ''));
  
  const handleLogSaved = (log: DailyLog) => {
    setTodayLog(log);
    setShowLoggingModal(false);
  };
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getDaysUntil = (dateStr: string) => {
    const targetDate = new Date(dateStr);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Daily Insight Card */}
      <div className="bg-gradient-to-r from-sage-100 to-rose-100 p-6 rounded-2xl border border-sage-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-sage-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-sage-800 mb-2">Today's Insight</h2>
            <p className="text-sage-700 leading-relaxed">{dailyInsight}</p>
          </div>
        </div>
      </div>
      
      {/* Date and Quick Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-sage-800">{formatDate(today)}</h1>
            <p className="text-sage-600">How are you feeling today?</p>
          </div>
          <button
            onClick={() => setShowLoggingModal(true)}
            className="bg-sage-500 text-white px-4 py-2 rounded-xl hover:bg-sage-600 transition-colors flex items-center space-x-2"
          >
            {todayLog ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{todayLog ? 'Edit' : 'Log'}</span>
          </button>
        </div>
        
        {/* Today's Log Summary */}
        {todayLog ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-sage-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Droplets className="w-5 h-5 text-sage-600" />
                <div>
                  <p className="text-xs text-sage-600 uppercase tracking-wide">Flow</p>
                  <p className="text-sm font-medium text-sage-800 capitalize">
                    {todayLog.periodFlow}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-rose-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-rose-600" />
                <div>
                  <p className="text-xs text-rose-600 uppercase tracking-wide">Symptoms</p>
                  <p className="text-sm font-medium text-rose-800">
                    {todayLog.symptoms.length > 0 ? `${todayLog.symptoms.length} logged` : 'None'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-cream-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Smile className="w-5 h-5 text-cream-600" />
                <div>
                  <p className="text-xs text-cream-600 uppercase tracking-wide">Moods</p>
                  <p className="text-sm font-medium text-cream-800">
                    {todayLog.moods.length > 0 ? `${todayLog.moods.length} logged` : 'None'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-sage-300 mx-auto mb-4" />
            <p className="text-sage-500">No log entry for today yet.</p>
            <p className="text-sm text-sage-400">Tap "Log" to record how you're feeling.</p>
          </div>
        )}
      </div>
      
      {/* Predictions */}
      {predictions && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-200">
          <h2 className="text-lg font-semibold text-sage-800 mb-4">Cycle Predictions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-rose-700 mb-2">Next Period</h3>
              <p className="text-xl font-bold text-rose-800">
                {getDaysUntil(predictions.nextPeriodDate)} days
              </p>
              <p className="text-sm text-rose-600">
                {new Date(predictions.nextPeriodDate).toLocaleDateString()}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-sage-50 to-sage-100 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-sage-700 mb-2">Fertile Window</h3>
              <p className="text-sm text-sage-800">
                {new Date(predictions.fertileWindowStart).toLocaleDateString()} - {new Date(predictions.fertileWindowEnd).toLocaleDateString()}
              </p>
              <p className="text-xs text-sage-600 mt-1">
                Confidence: {Math.round(predictions.confidence * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Logging Modal */}
      {showLoggingModal && (
        <LoggingModal
          date={today}
          existingLog={todayLog}
          onSave={handleLogSaved}
          onClose={() => setShowLoggingModal(false)}
        />
      )}
    </div>
  );
};

export default TodayView;