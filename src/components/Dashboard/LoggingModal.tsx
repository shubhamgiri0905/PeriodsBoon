import React, { useState } from 'react';
import { X, Save, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { DailyLog } from '../../types';

interface LoggingModalProps {
  date: string;
  existingLog: DailyLog | null;
  onSave: (log: DailyLog) => void;
  onClose: () => void;
}

const LoggingModal: React.FC<LoggingModalProps> = ({ date, existingLog, onSave, onClose }) => {
  const { user } = useAuth();
  const [periodFlow, setPeriodFlow] = useState<DailyLog['periodFlow']>(existingLog?.periodFlow || 'none');
  const [symptoms, setSymptoms] = useState<string[]>(existingLog?.symptoms || []);
  const [moods, setMoods] = useState<string[]>(existingLog?.moods || []);
  const [notes, setNotes] = useState(existingLog?.notes || '');
  const [showFlowInfo, setShowFlowInfo] = useState(false);
  const [showSymptomInfo, setShowSymptomInfo] = useState(false);
  const [showMoodInfo, setShowMoodInfo] = useState(false);
  
  const symptomOptions = [
    'cramps', 'headaches', 'bloating', 'breast_tenderness', 'fatigue', 
    'nausea', 'backache', 'acne', 'cravings', 'insomnia'
  ];
  
  const moodOptions = [
    'happy', 'sad', 'anxious', 'irritable', 'energetic', 
    'calm', 'stressed', 'emotional', 'confident', 'tired'
  ];
  
  const handleSymptomToggle = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };
  
  const handleMoodToggle = (mood: string) => {
    setMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };
  
  const handleSave = () => {
    if (!user) return;
    
    const log: DailyLog = {
      id: existingLog?.id || `log_${Date.now()}`,
      userId: user.id,
      date,
      periodFlow,
      symptoms,
      moods,
      notes: notes.trim() || undefined
    };
    
    storage.saveDailyLog(log);
    onSave(log);
  };
  
  const formatSymptomName = (symptom: string) => {
    return symptom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const formatMoodName = (mood: string) => {
    return mood.replace(/\b\w/g, l => l.toUpperCase());
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-200">
          <h2 className="text-xl font-semibold text-sage-800">
            Log for {new Date(date).toLocaleDateString()}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-sage-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-sage-600" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Period Flow */}
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-3">
              Period Flow
              <button 
                onClick={() => setShowFlowInfo(!showFlowInfo)}
                className="ml-2 text-sage-400 hover:text-sage-600"
              >
                <Info className="w-3 h-3 inline" />
              </button>
            </label>
            {showFlowInfo && (
              <div className="mb-3 p-3 bg-sage-50 rounded-lg text-sm text-sage-600">
                <p><strong>None:</strong> No menstrual flow</p>
                <p><strong>Light:</strong> Minimal flow, may need to change pad/tampon every 4-6 hours</p>
                <p><strong>Medium:</strong> Regular flow, change pad/tampon every 3-4 hours</p>
                <p><strong>Heavy:</strong> Heavy flow, need to change pad/tampon every 1-2 hours</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['none', 'light', 'medium', 'heavy'] as const).map(flow => (
                <button
                  key={flow}
                  onClick={() => setPeriodFlow(flow)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    periodFlow === flow
                      ? 'bg-rose-500 text-white'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {flow.charAt(0).toUpperCase() + flow.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-3">
              Symptoms
              <button 
                onClick={() => setShowSymptomInfo(!showSymptomInfo)}
                className="ml-2 text-sage-400 hover:text-sage-600"
              >
                <Info className="w-3 h-3 inline" />
              </button>
            </label>
            {showSymptomInfo && (
              <div className="mb-3 p-3 bg-sage-50 rounded-lg text-sm text-sage-600">
                <p>Track physical symptoms you're experiencing. Common symptoms include cramps, headaches, bloating, and fatigue. Select all that apply to you today.</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {symptomOptions.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`p-3 rounded-xl text-sm transition-all ${
                    symptoms.includes(symptom)
                      ? 'bg-sage-500 text-white'
                      : 'bg-sage-50 text-sage-700 hover:bg-sage-100'
                  }`}
                >
                  {formatSymptomName(symptom)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Moods */}
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-3">
              Moods
              <button 
                onClick={() => setShowMoodInfo(!showMoodInfo)}
                className="ml-2 text-sage-400 hover:text-sage-600"
              >
                <Info className="w-3 h-3 inline" />
              </button>
            </label>
            {showMoodInfo && (
              <div className="mb-3 p-3 bg-sage-50 rounded-lg text-sm text-sage-600">
                <p>Track your emotional state and mood changes. Hormonal fluctuations during your cycle can affect how you feel. Select all moods that describe how you're feeling today.</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {moodOptions.map(mood => (
                <button
                  key={mood}
                  onClick={() => handleMoodToggle(mood)}
                  className={`p-3 rounded-xl text-sm transition-all ${
                    moods.includes(mood)
                      ? 'bg-cream-500 text-white'
                      : 'bg-cream-50 text-cream-700 hover:bg-cream-100'
                  }`}
                >
                  {formatMoodName(mood)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-3">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling today? Any additional observations..."
              className="w-full p-4 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-transparent resize-none h-24"
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-sage-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sage-600 hover:text-sage-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-sage-500 text-white px-6 py-2 rounded-xl hover:bg-sage-600 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoggingModal;