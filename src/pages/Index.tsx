import React, { useState, useEffect } from 'react';
import EnhancedTutorHeader from '@/components/EnhancedTutorHeader';
import { groqService } from '@/services/GroqService';
import { MathHistoryService } from '@/services/MathHistoryService';
import { toast } from 'sonner';
import WelcomeSection from '@/components/home/WelcomeSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ScrollIndicator from '@/components/home/ScrollIndicator';
import AnswerDisplay from '@/components/AnswerDisplay';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<{
    question: string;
    answer: string;
    subject: string;
    inputType: 'text' | 'voice' | 'image';
    timestamp: Date;
    isCorrect?: boolean;
    mistake?: string;
  } | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmitQuestion = async (question: string, inputType: 'text' | 'voice' | 'image') => {
    setIsLoading(true);
    try {
      let processedQuestion = question;
      
      if (inputType === 'image') {
        toast.info("Processing math problem from image...");
        const response = await groqService.generateAnswer(
          question,
          'general-mathematics',
          inputType,
          true
        );
        processedQuestion = response;
      }

      if (inputType === 'voice') {
        toast.info("Processing your voice question...");
      }

      const answerText = await groqService.generateAnswer(
        processedQuestion,
        'general-mathematics',
        inputType,
        false
      );

      let isCorrect = undefined;
      let mistake = undefined;

      if (processedQuestion.includes('=')) {
        if (answerText.toLowerCase().includes('mistake') || answerText.toLowerCase().includes('error')) {
          isCorrect = false;
          mistake = "You may have made an error in solving for x. Check your calculations when isolating the variable.";
        } else {
          isCorrect = true;
        }
      }

      const answerObj = {
        question: processedQuestion,
        answer: answerText,
        subject: 'Mathematics',
        inputType,
        timestamp: new Date(),
        isCorrect,
        mistake
      };

      setAnswer(answerObj);

      if (user) {
        await MathHistoryService.saveHistory({
          question: processedQuestion,
          answer: answerText,
          subject: 'Mathematics',
          inputType,
          isCorrect,
          mistake
        });
      }

      const answerElement = document.getElementById('answer-section');
      if (answerElement) {
        answerElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to process your question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <EnhancedTutorHeader />
      <main className="flex-grow">
        <WelcomeSection 
          answer={answer}
          isLoading={isLoading}
          handleSubmitQuestion={handleSubmitQuestion}
        />
        <FeaturesSection />
        <ScrollIndicator show={showScrollIndicator} />
        <div id="answer-section">
          <AnswerDisplay 
            answer={answer} 
            isLoading={isLoading} 
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
