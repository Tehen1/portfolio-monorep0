import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (userData: any) => void;
  walletAddress: string;
}

export default function Onboarding({ onComplete, walletAddress }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    email: '',
    country: 'BE',
    language: 'en',
    fitnessLevel: 'beginner',
    goals: [] as string[],
    preferredActivities: [] as string[]
  });

  const steps = [
    {
      title: 'Welcome to Fixie.Run',
      description: 'Your Web3 fitness journey starts here',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl">🚴‍♂️</div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome to Fixie.Run!</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The future of fitness is here. Track your activities, compete with friends,
            and earn tokens through Web3-powered cycling adventures.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-700">
              Connected Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Personal Information',
      description: 'Help us customize your experience',
      content: (
        <div className="space-y-6 max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={userData.country}
              onChange={(e) => setUserData({ ...userData, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BE">Belgium</option>
              <option value="FR">France</option>
              <option value="NL">Netherlands</option>
              <option value="DE">Germany</option>
              <option value="LU">Luxembourg</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Language
            </label>
            <select
              value={userData.language}
              onChange={(e) => setUserData({ ...userData, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="nl">Nederlands</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: 'Fitness Profile',
      description: 'Tell us about your cycling experience',
      content: (
        <div className="space-y-6 max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              What's your fitness level?
            </label>
            <div className="space-y-3">
              {[
                { value: 'beginner', label: 'Beginner', desc: 'New to cycling or just getting back into it' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Regular rider, comfortable with moderate distances' },
                { value: 'advanced', label: 'Advanced', desc: 'Experienced cyclist, rides regularly' }
              ].map((level) => (
                <label
                  key={level.value}
                  className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    userData.fitnessLevel === level.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="fitnessLevel"
                    value={level.value}
                    checked={userData.fitnessLevel === level.value}
                    onChange={(e) => setUserData({ ...userData, fitnessLevel: e.target.value })}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-4 h-4 border-2 rounded-full mr-3 ${
                      userData.fitnessLevel === level.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {userData.fitnessLevel === level.value && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{level.label}</div>
                      <div className="text-sm text-gray-500">{level.desc}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Goals & Preferences',
      description: 'What do you want to achieve?',
      content: (
        <div className="space-y-6 max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              What are your main goals? (Select all that apply)
            </label>
            <div className="space-y-3">
              {[
                { value: 'weight_loss', label: 'Weight Loss' },
                { value: 'fitness', label: 'Improve Fitness' },
                { value: 'endurance', label: 'Build Endurance' },
                { value: 'social', label: 'Social Connection' },
                { value: 'competition', label: 'Competition' },
                { value: 'fun', label: 'Just for Fun' }
              ].map((goal) => (
                <label
                  key={goal.value}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={userData.goals.includes(goal.value)}
                    onChange={(e) => {
                      const newGoals = e.target.checked
                        ? [...userData.goals, goal.value]
                        : userData.goals.filter(g => g !== goal.value);
                      setUserData({ ...userData, goals: newGoals });
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-900">{goal.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Preferred activities? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'road', label: 'Road Cycling' },
                { value: 'mountain', label: 'Mountain Biking' },
                { value: 'commute', label: 'Commuting' },
                { value: 'touring', label: 'Bike Touring' },
                { value: 'racing', label: 'Racing' },
                { value: 'gravel', label: 'Gravel Riding' }
              ].map((activity) => (
                <label
                  key={activity.value}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={userData.preferredActivities.includes(activity.value)}
                    onChange={(e) => {
                      const newActivities = e.target.checked
                        ? [...userData.preferredActivities, activity.value]
                        : userData.preferredActivities.filter(a => a !== activity.value);
                      setUserData({ ...userData, preferredActivities: newActivities });
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">{activity.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Ready to Start!',
      description: 'Your fitness journey begins now',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl">🎯</div>
          <h2 className="text-3xl font-bold text-gray-900">You're All Set!</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Welcome to the Fixie.Run community. Start tracking your rides,
            join challenges, and earn tokens for your achievements.
          </p>

          <div className="bg-green-50 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Check className="w-6 h-6 text-green-600 mr-2" />
              <span className="text-green-700 font-medium">Profile Created</span>
            </div>
            <p className="text-sm text-green-600">
              Your Web3 fitness journey starts now with 50 bonus tokens!
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return userData.email && userData.country && userData.language;
      case 2:
        return userData.fitnessLevel;
      case 3:
        return userData.goals.length > 0 && userData.preferredActivities.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>

          {steps[currentStep].content}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                !canProceed()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
