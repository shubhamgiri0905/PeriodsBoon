import { CycleData, DailyLog, Prediction } from '../types';

export const calculatePredictions = (cycles: CycleData[], dailyLogs: DailyLog[]): Prediction | null => {
  if (cycles.length === 0) return null;
  
  // Get completed cycles (with end dates)
  const completedCycles = cycles.filter(cycle => cycle.endDate);
  
  if (completedCycles.length === 0) {
    // If no completed cycles, use the current cycle and default averages
    const currentCycle = cycles[cycles.length - 1];
    const startDate = new Date(currentCycle.startDate);
    const avgCycleLength = 28; // Default
    
    const nextPeriodDate = new Date(startDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);
    
    const fertileStart = new Date(nextPeriodDate);
    fertileStart.setDate(fertileStart.getDate() - 16); // Approximately 14 days before next period
    
    const fertileEnd = new Date(fertileStart);
    fertileEnd.setDate(fertileEnd.getDate() + 6);
    
    return {
      nextPeriodDate: nextPeriodDate.toISOString().split('T')[0],
      fertileWindowStart: fertileStart.toISOString().split('T')[0],
      fertileWindowEnd: fertileEnd.toISOString().split('T')[0],
      confidence: 0.3 // Low confidence with limited data
    };
  }
  
  // Calculate average cycle length from completed cycles
  const cycleLengths = completedCycles.map(cycle => {
    const start = new Date(cycle.startDate);
    const end = new Date(cycle.endDate!);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  });
  
  const avgCycleLength = Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length);
  
  // Get the most recent cycle
  const lastCycle = cycles[cycles.length - 1];
  const lastPeriodStart = new Date(lastCycle.startDate);
  
  // Predict next period
  const nextPeriodDate = new Date(lastPeriodStart);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);
  
  // Calculate fertile window (typically 12-16 days before next period)
  const fertileStart = new Date(nextPeriodDate);
  fertileStart.setDate(fertileStart.getDate() - 16);
  
  const fertileEnd = new Date(nextPeriodDate);
  fertileEnd.setDate(fertileEnd.getDate() - 10);
  
  // Calculate confidence based on cycle regularity
  const variance = cycleLengths.reduce((sum, length) => sum + Math.pow(length - avgCycleLength, 2), 0) / cycleLengths.length;
  const standardDeviation = Math.sqrt(variance);
  const confidence = Math.max(0.3, Math.min(0.95, 1 - (standardDeviation / avgCycleLength)));
  
  return {
    nextPeriodDate: nextPeriodDate.toISOString().split('T')[0],
    fertileWindowStart: fertileStart.toISOString().split('T')[0],
    fertileWindowEnd: fertileEnd.toISOString().split('T')[0],
    confidence
  };
};