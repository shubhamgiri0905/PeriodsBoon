import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Trash2, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { CycleData } from '../../types';

interface PastPeriodsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PastPeriodsModal: React.FC<PastPeriodsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [cycles, setCycles] = useState<CycleData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [periodLength, setPeriodLength] = useState(5);

  useEffect(() => {
    if (!user || !isOpen) return;
    
    const userCycles = storage.getCycles(user.id);
    setCycles(userCycles.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleAddCycle = () => {
    if (!user || !startDate) return;

    const newCycle: CycleData = {
      id: `cycle_${Date.now()}`,
      userId: user.id,
      startDate,
      endDate: endDate || undefined,
      predictedPeriodLength: periodLength
    };

    storage.addCycle(newCycle);
    setCycles([newCycle, ...cycles]);
    
    // Reset form
    setStartDate('');
    setEndDate('');
    setPeriodLength(5);
    setShowAddForm(false);
  };

  const handleDeleteCycle = (cycleId: string) => {
    if (!confirm('Are you sure you want to delete this cycle?')) return;

    const updatedCycles = cycles.filter(c => c.id !== cycleId);
    setCycles(updatedCycles);
    
    // Update storage
    const allCycles = JSON.parse(localStorage.getItem('PeriodsBoon_cycles') || '[]');
    const filteredCycles = allCycles.filter((c: CycleData) => c.id !== cycleId);
    localStorage.setItem('PeriodsBoon_cycles', JSON.stringify(filteredCycles));
  };

  const calculateCycleLength = (cycle: CycleData, nextCycle?: CycleData) => {
    if (!nextCycle) return null;
    const start = new Date(cycle.startDate);
    const nextStart = new Date(nextCycle.startDate);
    return Math.ceil((nextStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-200">
          <div>
            <h2 className="text-xl font-semibold text-sage-800">Past Periods</h2>
            <p className="text-sm text-sage-600">Add your historical cycle data for better predictions</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-sage-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-sage-600" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Info Box */}
          <div className="bg-sage-50 p-4 rounded-xl mb-6 flex items-start space-x-3">
            <Info className="w-5 h-5 text-sage-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-sage-800 mb-1">Why add past periods?</h3>
              <p className="text-sm text-sage-600">
                Adding your historical cycle data helps PeriodsBoon provide more accurate predictions. 
                The more data you provide, the better we can understand your unique patterns.
              </p>
            </div>
          </div>

          {/* Add New Cycle Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full mb-6 p-4 border-2 border-dashed border-sage-300 rounded-xl hover:border-sage-400 hover:bg-sage-50 transition-colors flex items-center justify-center space-x-2 text-sage-600"
            >
              <Plus className="w-5 h-5" />
              <span>Add Past Period</span>
            </button>
          )}

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-sage-50 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-sage-800 mb-4">Add Past Period</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Period Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Next Period Start (Optional)
                    <button className="ml-1 text-sage-400 hover:text-sage-600" title="This helps calculate cycle length">
                      <Info className="w-3 h-3 inline" />
                    </button>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Period Length (Days)
                  </label>
                  <input
                    type="number"
                    value={periodLength}
                    onChange={(e) => setPeriodLength(parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setStartDate('');
                    setEndDate('');
                    setPeriodLength(5);
                  }}
                  className="px-6 py-2 text-sage-600 hover:text-sage-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCycle}
                  disabled={!startDate}
                  className="bg-sage-500 text-white px-6 py-2 rounded-xl hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Period
                </button>
              </div>
            </div>
          )}

          {/* Cycles List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-sage-800">Your Cycle History</h3>
            
            {cycles.length > 0 ? (
              <div className="space-y-3">
                {cycles.map((cycle, index) => {
                  const nextCycle = cycles[index + 1];
                  const cycleLength = calculateCycleLength(cycle, nextCycle);
                  
                  return (
                    <div key={cycle.id} className="bg-white border border-sage-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Calendar className="w-5 h-5 text-sage-600" />
                          <div>
                            <p className="font-medium text-sage-800">
                              {formatDate(cycle.startDate)}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-sage-600">
                              <span>Period: {cycle.predictedPeriodLength} days</span>
                              {cycleLength && (
                                <span>Cycle: {cycleLength} days</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteCycle(cycle.id)}
                          className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-sage-300 mx-auto mb-4" />
                <p className="text-sage-500">No past periods recorded yet.</p>
                <p className="text-sm text-sage-400">Add your historical data to improve predictions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastPeriodsModal;