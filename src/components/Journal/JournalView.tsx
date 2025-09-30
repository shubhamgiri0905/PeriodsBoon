import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, CreditCard as Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { JournalEntry } from '../../types';

const JournalView: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    const journalEntries = storage.getJournalEntries(user.id);
    setEntries(journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [user]);
  
  const handleSaveEntry = () => {
    if (!user || !title.trim()) return;
    
    const entry: JournalEntry = {
      id: editingEntry?.id || `entry_${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString(),
      title: title.trim(),
      content: content.trim(),
      tags
    };
    
    if (editingEntry) {
      // Update existing entry
      const updatedEntries = entries.map(e => e.id === editingEntry.id ? entry : e);
      setEntries(updatedEntries);
    } else {
      // Create new entry
      storage.saveJournalEntry(entry);
      setEntries([entry, ...entries]);
    }
    
    // Reset form
    setTitle('');
    setContent('');
    setTags([]);
    setShowNewEntry(false);
    setEditingEntry(null);
  };
  
  const handleEditEntry = (entry: JournalEntry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setTags(entry.tags);
    setEditingEntry(entry);
    setShowNewEntry(true);
  };
  
  const handleDeleteEntry = (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const updatedEntries = entries.filter(e => e.id !== entryId);
      setEntries(updatedEntries);
      
      // Update storage
      const allEntries = JSON.parse(localStorage.getItem('PeriodsBoon_journal_entries') || '[]');
      const filteredEntries = allEntries.filter((e: JournalEntry) => e.id !== entryId);
      localStorage.setItem('PeriodsBoon_journal_entries', JSON.stringify(filteredEntries));
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };
  
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const suggestedTags = ['reflection', 'gratitude', 'pms', 'energy', 'mood', 'symptoms', 'self-care'];
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-sage-800">Your Journal</h1>
          <p className="text-sage-600">Capture your thoughts and reflections</p>
        </div>
        
        <button
          onClick={() => setShowNewEntry(true)}
          className="bg-sage-500 text-white px-4 py-2 rounded-xl hover:bg-sage-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>
      
      {/* New/Edit Entry Form */}
      {showNewEntry && (
        <div className="bg-white rounded-2xl shadow-sm border border-sage-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-sage-800 mb-4">
            {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
          </h2>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your entry a title..."
                className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-transparent"
              />
            </div>
            
            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Your thoughts
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind today? How are you feeling?"
                className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-transparent resize-none h-32"
              />
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-sage-500 hover:text-sage-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.filter(tag => !tags.includes(tag)).map(tag => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="bg-sage-50 text-sage-600 px-3 py-1 rounded-full text-sm hover:bg-sage-100 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowNewEntry(false);
                  setEditingEntry(null);
                  setTitle('');
                  setContent('');
                  setTags([]);
                }}
                className="px-6 py-2 text-sage-600 hover:text-sage-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEntry}
                disabled={!title.trim()}
                className="bg-sage-500 text-white px-6 py-2 rounded-xl hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingEntry ? 'Update' : 'Save'} Entry
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Journal Entries */}
      {entries.length > 0 ? (
        <div className="space-y-6">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl shadow-sm border border-sage-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-sage-800 mb-1">{entry.title}</h3>
                  <p className="text-sm text-sage-600">{formatDate(entry.date)}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditEntry(entry)}
                    className="p-2 text-sage-600 hover:text-sage-800 hover:bg-sage-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sage-700 leading-relaxed mb-4 whitespace-pre-wrap">
                {entry.content}
              </p>
              
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-sage-50 text-sage-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-sage-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-sage-800 mb-2">Start Your Journal</h3>
          <p className="text-sage-600 mb-6 max-w-md mx-auto">
            Journaling can help you process emotions, track patterns, and celebrate your journey. 
            Your thoughts are safe and private here.
          </p>
          <button
            onClick={() => setShowNewEntry(true)}
            className="bg-sage-500 text-white px-6 py-3 rounded-xl hover:bg-sage-600 transition-colors"
          >
            Write Your First Entry
          </button>
        </div>
      )}
    </div>
  );
};

export default JournalView;