import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { calculatePredictions } from '../../utils/predictions';
import { DailyLog, CycleData } from '../../types';

const CalendarView: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [cycles, setCycles] = useState<CycleData[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    const logs = storage.getDailyLogs(user.id);
    const userCycles = storage.getCycles(user.id);
    
    setDailyLogs(logs);
    setCycles(userCycles);
  }, [user]);
  
  const predictions = calculatePredictions(cycles, dailyLogs);
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const getLogForDate = (date: Date): DailyLog | null => {
    const dateStr = date.toISOString().split('T')[0];
    return dailyLogs.find(log => log.date === dateStr) || null;
  };
  
  const isPredictedPeriod = (date: Date): boolean => {
    if (!predictions) return false;
    const dateStr = date.toISOString().split('T')[0];
    const nextPeriod = new Date(predictions.nextPeriodDate);
    const periodEnd = new Date(nextPeriod);
    periodEnd.setDate(periodEnd.getDate() + 5); // Assume 5-day period
    
    return date >= nextPeriod && date <= periodEnd;
  };
  
  const isFertileWindow = (date: Date): boolean => {
    if (!predictions) return false;
    const dateStr = date.toISOString().split('T')[0];
    const fertileStart = new Date(predictions.fertileWindowStart);
    const fertileEnd = new Date(predictions.fertileWindowEnd);
    
    return date >= fertileStart && date <= fertileEnd;
  };
  
  const renderCalendarDay = (date: Date, isCurrentMonth: boolean) => {
    const log = getLogForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const hasPeriod = log?.periodFlow && log.periodFlow !== 'none';
    const hasSymptoms = log?.symptoms && log.symptoms.length > 0;
    const isPredicted = isPredictedPeriod(date);
    const isFertile = isFertileWindow(date);
    
    let bgColor = 'hover:bg-sage-50';
    let textColor = isCurrentMonth ? 'text-sage-800' : 'text-sage-400';
    
    if (isToday) {
      bgColor = 'bg-sage-100 border-2 border-sage-300';
    } else if (hasPeriod) {
      bgColor = 'bg-rose-100';
      textColor = 'text-rose-800';
    } else if (isPredicted) {
      bgColor = 'bg-rose-50 border-2 border-dashed border-rose-300';
      textColor = 'text-rose-600';
    } else if (isFertile) {
      bgColor = 'bg-sage-50 border-2 border-dashed border-sage-300';
      textColor = 'text-sage-600';
    }
    
    return (
      <div
        key={date.toISOString()}
        className={`
          aspect-square p-1 rounded-lg transition-all cursor-pointer
          ${bgColor} ${textColor}
        `}
      >
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <span className="text-sm font-medium">{date.getDate()}</span>
          
          {/* Indicators */}
          <div className="flex items-center space-x-1 mt-1">
            {hasPeriod && <Droplets className="w-3 h-3 text-rose-600" />}
            {hasSymptoms && <Heart className="w-3 h-3 text-sage-600" />}
          </div>
        </div>
      </div>
    );
  };
  
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i);
      days.push(renderCalendarDay(date, false));
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push(renderCalendarDay(date, true));
    }
    
    // Next month's leading days
    const totalCells = Math.ceil(days.length / 7) * 7;
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    for (let day = 1; days.length < totalCells; day++) {
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
      days.push(renderCalendarDay(date, false));
    }
    
    return days;
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-sage-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-sage-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-sage-600" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-sage-600" />
            </button>
          </div>
        </div>
        
        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-sage-600 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendar()}
        </div>
      </div>
      
      {/* Legend */}
      <div className="bg-white rounded-2xl shadow-sm border border-sage-200 p-6">
        <h2 className="text-lg font-semibold text-sage-800 mb-4">Legend</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-rose-600" />
            </div>
            <span className="text-sm text-sage-700">Period days</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-rose-50 border-2 border-dashed border-rose-300 rounded-lg"></div>
            <span className="text-sm text-sage-700">Predicted period</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sage-50 border-2 border-dashed border-sage-300 rounded-lg"></div>
            <span className="text-sm text-sage-700">Fertile window</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white border border-sage-300 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-sage-600" />
            </div>
            <span className="text-sm text-sage-700">Symptoms logged</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;