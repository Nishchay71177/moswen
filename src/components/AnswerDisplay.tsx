
import React, { useState } from 'react';
import { Check, X, Volume2, Copy, ThumbsUp, ThumbsDown, Edit, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface AnswerDisplayProps {
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
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState('');

  if (!answer) return null;

  const speakAnswer = () => {
    const utterance = new SpeechSynthesisUtterance(answer.answer);
    window.speechSynthesis.speak(utterance);
    toast.success("Speaking answer");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer.answer);
    toast.success("Copied to clipboard");
  };

  const startEditing = () => {
    setEditedQuestion(answer.question);
    setIsEditing(true);
  };

  const saveEditing = () => {
    // In a real app, this would update the backend
    // For now, we're just showing what it would look like
    toast.success("Question updated");
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    toast.info("Editing cancelled");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto"
      >
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur shadow-xl border-tutor-purple/10 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold tutor-gradient-text">Solution</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Subject: {answer.subject} • {answer.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {answer.isCorrect !== undefined && (
                <div className={`flex items-center ${answer.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {answer.isCorrect ? (
                    <>
                      <Check className="h-5 w-5 mr-1" />
                      <span className="font-medium">Correct</span>
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5 mr-1" />
                      <span className="font-medium">Incorrect</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-lg">Your Question:</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={isEditing ? cancelEditing : startEditing}
                  className="h-8 px-2"
                >
                  {isEditing ? (
                    <RotateCcw className="h-4 w-4 mr-1" />
                  ) : (
                    <Edit className="h-4 w-4 mr-1" />
                  )}
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editedQuestion}
                    onChange={(e) => setEditedQuestion(e.target.value)}
                    className="min-h-[80px] text-base"
                  />
                  <Button size="sm" onClick={saveEditing} className="h-8">
                    <Save className="h-4 w-4 mr-1" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-200 dark:border-gray-700 text-base">
                  {answer.question}
                </p>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-lg mb-2">Solution:</h3>
              <div className="markdown-content bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md border border-gray-200 dark:border-gray-700 text-base leading-relaxed">
                <ReactMarkdown>
                  {answer.answer}
                </ReactMarkdown>
              </div>
            </div>
            
            {answer.mistake && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-md">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2 text-base">Common Mistake Identified:</h3>
                <p className="text-red-600 dark:text-red-300 text-base">{answer.mistake}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t pt-4 flex flex-wrap gap-3 justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={speakAnswer} className="h-9">
                <Volume2 className="h-4 w-4 mr-2" />
                Speak
              </Button>
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-9">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="h-9">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Helpful
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <ThumbsDown className="h-4 w-4 mr-2" />
                Not Helpful
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnswerDisplay;
