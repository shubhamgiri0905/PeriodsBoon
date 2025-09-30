import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Heart, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { getSymptomInsights } from '../../utils/insights';
import { DailyLog, CycleData } from '../../types';

const InsightsView: React.FC = () => {
  const { user } = useAuth();
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [cycles, setCycles] = useState<CycleData[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    const logs = storage.getDailyLogs(user.id);
    const userCycles = storage.getCycles(user.id);
    
    setDailyLogs(logs);
    setCycles(userCycles);
    
    // Get symptom insights
    const symptomInsights = getSymptomInsights(logs);
    setInsights(symptomInsights);
  }, [user]);
  
  // Calculate cycle stats
  const completedCycles = cycles.filter(cycle => cycle.endDate);
  const avgCycleLength = completedCycles.length > 0 
    ? Math.round(completedCycles.reduce((sum, cycle) => {
        const start = new Date(cycle.startDate);
        const end = new Date(cycle.endDate!);
        return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }, 0) / completedCycles.length)
    : user?.avgCycleLength || 28;
  
  // Symptom frequency analysis
  const symptomCounts = dailyLogs
    .flatMap(log => log.symptoms)
    .reduce((acc, symptom) => {
      acc[symptom] = (acc[symptom] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const topSymptoms = Object.entries(symptomCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([symptom, count]) => ({
      name: symptom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: Math.round((count / dailyLogs.length) * 100)
    }));
  
  // Mood analysis
  const moodCounts = dailyLogs
    .flatMap(log => log.moods)
    .reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const topMoods = Object.entries(moodCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([mood, count]) => ({
      name: mood.replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: Math.round((count / dailyLogs.length) * 100)
    }));
  
  // Period flow analysis
  const flowCounts = dailyLogs
    .filter(log => log.periodFlow !== 'none')
    .reduce((acc, log) => {
      acc[log.periodFlow] = (acc[log.periodFlow] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const totalPeriodDays = Object.values(flowCounts).reduce((sum, count) => sum + count, 0);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-sage-800 mb-2">Your Cycle Insights</h1>
        <p className="text-sage-600">Understanding your patterns for better health</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-sage-600" />
            </div>
            <h3 className="text-lg font-semibold text-sage-800">Cycle Length</h3>
          </div>
          <p className="text-3xl font-bold text-sage-800 mb-1">{avgCycleLength} days</p>
          <p className="text-sm text-sage-600">Average length</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-sage-800">Data Points</h3>
          </div>
          <p className="text-3xl font-bold text-sage-800 mb-1">{dailyLogs.length}</p>
          <p className="text-sm text-sage-600">Days logged</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-cream-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-cream-600" />
            </div>
            <h3 className="text-lg font-semibold text-sage-800">Cycles Tracked</h3>
          </div>
          <p className="text-3xl font-bold text-sage-800 mb-1">{cycles.length}</p>
          <p className="text-sm text-sage-600">Total cycles</p>
        </div>
      </div>
      
      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-br from-sage-50 to-rose-50 p-6 rounded-2xl border border-sage-200">
          <h2 className="text-lg font-semibold text-sage-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Personal Insights
          </h2>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white/60 p-4 rounded-xl">
                <p className="text-sage-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Symptom Analysis */}
      {topSymptoms.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-200">
          <h2 className="text-lg font-semibold text-sage-800 mb-4">Most Common Symptoms</h2>
          <div className="space-y-3">
            {topSymptoms.map((symptom, index) => (
              <div key={symptom.name} className="flex items-center justify-between">
                <span className="text-sage-700">{symptom.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-sage-100 rounded-full h-2">
                    <div 
                      className="bg-sage-500 h-2 rounded-full"
                      style={{ width: `${symptom.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-sage-600 w-12 text-right">
                    {symptom.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Mood Analysis */}
      {topMoods.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-200">
          <h2 className="text-lg font-semibold text-sage-800 mb-4">Most Common Moods</h2>
          <div className="space-y-3">
            {topMoods.map((mood, index) => (
              <div key={mood.name} className="flex items-center justify-between">
                <span className="text-sage-700">{mood.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-cream-100 rounded-full h-2">
                    <div 
                      className="bg-cream-500 h-2 rounded-full"
                      style={{ width: `${mood.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-sage-600 w-12 text-right">
                    {mood.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Period Flow Analysis */}
      {totalPeriodDays > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-200">
          <h2 className="text-lg font-semibold text-sage-800 mb-4">Period Flow Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(flowCounts).map(([flow, count]) => (
              <div key={flow} className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-rose-600">
                    {Math.round((count / totalPeriodDays) * 100)}%
                  </span>
                </div>
                <p className="text-sm font-medium text-sage-800 capitalize">{flow}</p>
                <p className="text-xs text-sage-600">{count} days</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {dailyLogs.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-sage-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-sage-800 mb-2">Start Your Journey</h3>
          <p className="text-sage-600 mb-6">
            Begin logging your daily symptoms and moods to unlock personalized insights about your cycle.
          </p>
          <div className="bg-sage-50 p-4 rounded-xl max-w-md mx-auto">
            <p className="text-sm text-sage-700">
              The more you log, the better we can help you understand your unique patterns and provide meaningful insights.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsView;