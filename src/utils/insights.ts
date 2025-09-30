import { DailyLog, CycleData } from '../types';

interface Insight {
  message: string;
  type: 'affirmation' | 'tip' | 'observation';
}

export const getDailyInsight = (
  currentDate: string, 
  dailyLogs: DailyLog[], 
  cycles: CycleData[]
): Insight => {
  const today = new Date(currentDate);
  const todayLog = dailyLogs.find(log => log.date === currentDate);
  
  // Get current cycle info
  const currentCycle = cycles.find(cycle => {
    const start = new Date(cycle.startDate);
    const end = cycle.endDate ? new Date(cycle.endDate) : new Date();
    return today >= start && today <= end;
  });
  
  // Calculate cycle day
  let cycleDay = 1;
  if (currentCycle) {
    const start = new Date(currentCycle.startDate);
    cycleDay = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }
  
  // Period phase insights
  if (todayLog?.periodFlow && todayLog.periodFlow !== 'none') {
    const heavyFlowTips = [
      "Remember to stay hydrated and get plenty of rest during your heavier flow days.",
      "Iron-rich foods like spinach and lentils can help replenish what your body needs right now.",
      "Your body is doing incredible work. Be gentle with yourself today."
    ];
    
    const lightFlowTips = [
      "Light flow days are a great time for gentle movement like walking or stretching.",
      "You're in tune with your body's natural rhythm. Trust the process.",
      "This is a perfect time for some peaceful self-reflection."
    ];
    
    if (todayLog.periodFlow === 'heavy') {
      return {
        message: heavyFlowTips[Math.floor(Math.random() * heavyFlowTips.length)],
        type: 'tip'
      };
    } else if (todayLog.periodFlow === 'light') {
      return {
        message: lightFlowTips[Math.floor(Math.random() * lightFlowTips.length)],
        type: 'tip'
      };
    }
  }
  
  // Cycle phase insights
  if (cycleDay <= 7) {
    const menstrualPhaseInsights = [
      "Your body is naturally releasing and renewing. Honor this time of rest and reflection.",
      "This is your body's time to reset. Be patient and compassionate with yourself.",
      "You're in your wise, intuitive phase. Trust your inner voice today."
    ];
    
    return {
      message: menstrualPhaseInsights[Math.floor(Math.random() * menstrualPhaseInsights.length)],
      type: 'affirmation'
    };
  } else if (cycleDay <= 14) {
    const follicularPhaseInsights = [
      "Your energy is naturally building. This is a wonderful time for new beginnings.",
      "You might feel more social and outgoing right now. Embrace these connections.",
      "Your creativity and problem-solving abilities are at their peak."
    ];
    
    return {
      message: follicularPhaseInsights[Math.floor(Math.random() * follicularPhaseInsights.length)],
      type: 'affirmation'
    };
  } else if (cycleDay <= 21) {
    const ovulatoryPhaseInsights = [
      "You're in your most energetic phase. Channel this power into what matters most.",
      "Your communication skills are naturally enhanced right now.",
      "This is an excellent time for important conversations and decisions."
    ];
    
    return {
      message: ovulatoryPhaseInsights[Math.floor(Math.random() * ovulatoryPhaseInsights.length)],
      type: 'affirmation'
    };
  } else {
    const lutealPhaseInsights = [
      "Your body is preparing and organizing. Focus on completing projects and self-care.",
      "This is a natural time for introspection and planning ahead.",
      "Listen to your body's wisdom. Rest when you need to rest."
    ];
    
    return {
      message: lutealPhaseInsights[Math.floor(Math.random() * lutealPhaseInsights.length)],
      type: 'affirmation'
    };
  }
};

export const getSymptomInsights = (dailyLogs: DailyLog[]): string[] => {
  const insights: string[] = [];
  
  // Analyze recent logs for patterns
  const recentLogs = dailyLogs.slice(-7); // Last 7 days
  
  const commonSymptoms = recentLogs
    .flatMap(log => log.symptoms)
    .reduce((acc, symptom) => {
      acc[symptom] = (acc[symptom] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  // Provide insights for common symptoms
  Object.entries(commonSymptoms).forEach(([symptom, frequency]) => {
    if (frequency >= 3) {
      switch (symptom) {
        case 'headaches':
          insights.push("You've noted headaches recently. Stay hydrated and consider gentle temple massages.");
          break;
        case 'cramps':
          insights.push("For cramp relief, try heat therapy, gentle stretching, or herbal teas like chamomile.");
          break;
        case 'bloating':
          insights.push("Bloating is common during your cycle. Try reducing salt intake and gentle abdominal massage.");
          break;
        case 'fatigue':
          insights.push("Your body needs extra rest right now. Don't hesitate to slow down and prioritize sleep.");
          break;
      }
    }
  });
  
  return insights;
};