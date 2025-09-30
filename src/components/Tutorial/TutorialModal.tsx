import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Calendar, BarChart3, BookOpen, Droplets, Smile } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tutorialSteps = [
    {
      title: "Welcome to PeriodsBoon",
      icon: Heart,
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-sage-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-sage-800 mb-4">Your Supportive Cycle Companion</h3>
          <p className="text-sage-600 leading-relaxed">
            PeriodsBoon is designed to help you understand your menstrual cycle better while providing 
            supportive insights and predictions. Let's take a quick tour to get you started.
          </p>
        </div>
      )
    },
    {
      title: "Today View - Your Daily Hub",
      icon: Heart,
      content: (
        <div>
          <div className="bg-gradient-to-r from-sage-100 to-rose-100 p-4 rounded-xl mb-4">
            <Heart className="w-8 h-8 text-sage-600 mb-2" />
            <h4 className="font-semibold text-sage-800 mb-2">Daily Insights</h4>
            <p className="text-sm text-sage-700">
              Each day, you'll receive personalized insights based on your cycle phase and logged data.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
                <Droplets className="w-4 h-4 text-sage-600" />
              </div>
              <div>
                <p className="font-medium text-sage-800">Period Flow</p>
                <p className="text-sm text-sage-600">Track your flow intensity (none, light, medium, heavy)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="font-medium text-sage-800">Symptoms</p>
                <p className="text-sm text-sage-600">Log physical symptoms like cramps, headaches, bloating</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cream-100 rounded-lg flex items-center justify-center">
                <Smile className="w-4 h-4 text-cream-600" />
              </div>
              <div>
                <p className="font-medium text-sage-800">Moods</p>
                <p className="text-sm text-sage-600">Track your emotional state and mood changes</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Calendar View - Visual Overview",
      icon: Calendar,
      content: (
        <div>
          <Calendar className="w-12 h-12 text-sage-600 mb-4" />
          <h4 className="font-semibold text-sage-800 mb-3">Your Cycle at a Glance</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-3 h-3 text-rose-600" />
                </div>
                <span className="text-sm text-sage-700">Period days</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-rose-50 border-2 border-dashed border-rose-300 rounded-lg"></div>
                <span className="text-sm text-sage-700">Predicted period</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-sage-50 border-2 border-dashed border-sage-300 rounded-lg"></div>
                <span className="text-sm text-sage-700">Fertile window</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white border border-sage-300 rounded-lg flex items-center justify-center">
                  <Heart className="w-3 h-3 text-sage-600" />
                </div>
                <span className="text-sm text-sage-700">Symptoms logged</span>
              </div>
            </div>
            <p className="text-sm text-sage-600">
              The calendar shows your cycle history and predictions. Tap any day to view or edit your log for that date.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Insights - Understanding Your Patterns",
      icon: BarChart3,
      content: (
        <div>
          <BarChart3 className="w-12 h-12 text-sage-600 mb-4" />
          <h4 className="font-semibold text-sage-800 mb-3">Personalized Analytics</h4>
          <div className="space-y-4">
            <div className="bg-sage-50 p-4 rounded-xl">
              <h5 className="font-medium text-sage-800 mb-2">Cycle Statistics</h5>
              <p className="text-sm text-sage-600">
                View your average cycle length, most common symptoms, and mood patterns over time.
              </p>
            </div>
            <div className="bg-rose-50 p-4 rounded-xl">
              <h5 className="font-medium text-sage-800 mb-2">Pattern Recognition</h5>
              <p className="text-sm text-sage-600">
                Discover connections between your symptoms, moods, and cycle phases to better understand your body.
              </p>
            </div>
            <p className="text-sm text-sage-600">
              The more you log, the more accurate and helpful these insights become!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Journal - Your Private Space",
      icon: BookOpen,
      content: (
        <div>
          <BookOpen className="w-12 h-12 text-sage-600 mb-4" />
          <h4 className="font-semibold text-sage-800 mb-3">Reflect and Record</h4>
          <div className="space-y-4">
            <p className="text-sage-600">
              Use the journal to capture your thoughts, feelings, and experiences. This private space is just for you.
            </p>
            <div className="bg-cream-50 p-4 rounded-xl">
              <h5 className="font-medium text-sage-800 mb-2">Benefits of Journaling</h5>
              <ul className="text-sm text-sage-600 space-y-1">
                <li>• Process emotions and experiences</li>
                <li>• Track patterns in your thoughts and feelings</li>
                <li>• Celebrate your journey and growth</li>
                <li>• Create a personal record of your cycle experience</li>
              </ul>
            </div>
            <p className="text-sm text-sage-600">
              Add tags to your entries to make them easier to find and organize later.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Privacy & Your Data",
      icon: Heart,
      content: (
        <div>
          <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-sage-600" />
          </div>
          <h4 className="font-semibold text-sage-800 mb-3">Your Privacy Matters</h4>
          <div className="space-y-4">
            <div className="bg-sage-50 p-4 rounded-xl">
              <h5 className="font-medium text-sage-800 mb-2">Local Storage</h5>
              <p className="text-sm text-sage-600">
                All your data is stored locally on your device. We never share your personal information with third parties.
              </p>
            </div>
            <div className="bg-rose-50 p-4 rounded-xl">
              <h5 className="font-medium text-sage-800 mb-2">Data Control</h5>
              <p className="text-sm text-sage-600">
                You have complete control over your data. Export it anytime or delete it whenever you want.
              </p>
            </div>
            <p className="text-sm text-sage-600">
              Your trust is important to us. We're committed to keeping your personal health information secure and private.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      icon: Heart,
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-sage-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-sage-800 mb-4">Ready to Begin Your Journey</h3>
          <p className="text-sage-600 leading-relaxed mb-6">
            You now know how to use all of PeriodsBoon's features. Remember, the more consistently you log, 
            the better insights and predictions you'll receive.
          </p>
          <div className="bg-gradient-to-r from-sage-50 to-rose-50 p-4 rounded-xl">
            <p className="text-sm text-sage-700">
              <strong>Tip:</strong> Start by logging today's information, then gradually add past period data 
              in Settings → Log Past Periods for more accurate predictions.
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-200">
          <div className="flex items-center space-x-3">
            <currentTutorial.icon className="w-6 h-6 text-sage-600" />
            <h2 className="text-xl font-semibold text-sage-800">{currentTutorial.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-sage-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-sage-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-sage-600">
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
            <span className="text-sm text-sage-600">
              {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-sage-100 rounded-full h-2">
            <div 
              className="bg-sage-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {currentTutorial.content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-sage-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-sage-600 hover:text-sage-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-sage-500' : 'bg-sage-200'
                }`}
              />
            ))}
          </div>

          {currentStep === tutorialSteps.length - 1 ? (
            <button
              onClick={onClose}
              className="bg-sage-500 text-white px-6 py-2 rounded-xl hover:bg-sage-600 transition-colors"
            >
              Get Started
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-sage-500 text-white px-4 py-2 rounded-xl hover:bg-sage-600 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;