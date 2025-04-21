
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UnifiedSearch from '@/components/UnifiedSearch';
import AnswerDisplay from '@/components/AnswerDisplay';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeSectionProps {
  answer: {
    question: string;
    answer: string;
    subject: string;
    inputType: 'text' | 'voice' | 'image';
    timestamp: Date;
    isCorrect?: boolean;
    mistake?: string;
  } | null;
  isLoading: boolean;
  handleSubmitQuestion: (question: string, inputType: 'text' | 'voice' | 'image') => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ answer, isLoading, handleSubmitQuestion }) => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto w-full"
      >
        <div className="mb-4 inline-block p-2 bg-tutor-purple/10 rounded-full">
          <Sparkles className="h-6 w-6 text-tutor-purple" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tutor-gradient-text">
          Your Personal Math Problem Solver
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Get instant, step-by-step solutions to any math problem. Powered by advanced AI to help you learn and understand.
        </p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <UnifiedSearch 
            onSubmitQuestion={handleSubmitQuestion}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 w-full"
        >
          <AnswerDisplay 
            answer={answer} 
            isLoading={isLoading} 
          />
        </motion.div>

        {user && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Button 
              onClick={() => window.location.href = '/profile'} 
              variant="outline"
              className="group"
            >
              View Your Problem History
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default WelcomeSection;
