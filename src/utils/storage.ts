import { User, CycleData, DailyLog, JournalEntry } from '../types';

const STORAGE_KEYS = {
  USER: 'PeriodsBoon_user',
  CYCLES: 'PeriodsBoon_cycles',
  DAILY_LOGS: 'PeriodsBoon_daily_logs',
  JOURNAL_ENTRIES: 'PeriodsBoon_journal_entries',
  CURRENT_USER_ID: 'PeriodsBoon_current_user_id'
};

export const storage = {
  // User management
  setCurrentUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
  },
  
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },
  
  getCurrentUserId: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  },
  
  clearCurrentUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  },
  
  // Cycles
  saveCycles: (cycles: CycleData[]) => {
    localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles));
  },
  
  getCycles: (userId: string): CycleData[] => {
    const cycles = localStorage.getItem(STORAGE_KEYS.CYCLES);
    const allCycles: CycleData[] = cycles ? JSON.parse(cycles) : [];
    return allCycles.filter(cycle => cycle.userId === userId);
  },
  
  addCycle: (cycle: CycleData) => {
    const cycles = JSON.parse(localStorage.getItem(STORAGE_KEYS.CYCLES) || '[]');
    cycles.push(cycle);
    localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles));
  },
  
  // Daily logs
  saveDailyLogs: (logs: DailyLog[]) => {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  },
  
  getDailyLogs: (userId: string): DailyLog[] => {
    const logs = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    const allLogs: DailyLog[] = logs ? JSON.parse(logs) : [];
    return allLogs.filter(log => log.userId === userId);
  },
  
  getDailyLog: (userId: string, date: string): DailyLog | null => {
    const logs = storage.getDailyLogs(userId);
    return logs.find(log => log.date === date) || null;
  },
  
  saveDailyLog: (log: DailyLog) => {
    const logs = storage.getDailyLogs(log.userId);
    const existingIndex = logs.findIndex(l => l.date === log.date);
    
    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    
    const allLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '[]');
    const otherUserLogs = allLogs.filter((l: DailyLog) => l.userId !== log.userId);
    const updatedLogs = [...otherUserLogs, ...logs];
    
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(updatedLogs));
  },
  
  // Journal entries
  getJournalEntries: (userId: string): JournalEntry[] => {
    const entries = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    const allEntries: JournalEntry[] = entries ? JSON.parse(entries) : [];
    return allEntries.filter(entry => entry.userId === userId);
  },
  
  saveJournalEntry: (entry: JournalEntry) => {
    const allEntries = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES) || '[]');
    allEntries.push(entry);
    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(allEntries));
  }
};