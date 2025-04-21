import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Image, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface UnifiedSearchProps {
  onSubmitQuestion: (question: string, inputType: 'text' | 'voice' | 'image') => void;
  isLoading: boolean;
}

const UnifiedSearch: React.FC<UnifiedSearchProps> = ({ onSubmitQuestion, isLoading }) => {
  const [question, setQuestion] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const { startRecording: initSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmitQuestion(question, 'text');
      setQuestion('');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      const recognition = await initSpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setQuestion(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Error during speech recognition');
        stopRecording();
      };

      recognition.onend = () => {
        stopRecording();
      };

      recognition.start();
      
      toast.info('Voice recording started', {
        description: 'Speak clearly to ensure accurate transcription'
      });
      
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 15000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    setIsRecording(false);
    toast.success('Voice recording completed');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = event.target?.result as string;
          setUploadedImage(base64Image);
        };
        reader.onerror = () => {
          toast.error('Error reading image file');
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const handleImageSubmit = () => {
    if (uploadedImage) {
      onSubmitQuestion(uploadedImage, 'image');
      setUploadedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto w-full"
    >
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-xl border-tutor-purple/10 overflow-hidden">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {uploadedImage ? (
              <motion.div 
                key="image-upload"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded question" 
                    className="w-full h-auto object-contain max-h-[200px]" 
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full"
                    onClick={clearUploadedImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Button 
                  onClick={handleImageSubmit} 
                  className="w-full bg-gradient-to-r from-tutor-orange to-tutor-purple hover:opacity-90 text-white font-medium text-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>Analyze Image</>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.form 
                key="text-input"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit} 
                className="space-y-4"
              >
                <div className="relative">
                  <Textarea
                    placeholder="Ask any math question..."
                    value={question}
                    onChange={handleQuestionChange}
                    className="min-h-[120px] bg-white/80 dark:bg-gray-700/80 resize-none border-gray-200 dark:border-gray-600 focus:border-tutor-purple/50 focus:ring-tutor-purple/50 transition-all duration-200 text-lg font-medium"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-md">
                      <Loader2 className="h-8 w-8 text-tutor-purple animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-tutor-blue to-tutor-purple hover:opacity-90 text-white transition-all duration-300 shadow-md hover:shadow-lg text-lg font-medium py-6"
                    disabled={!question.trim() || isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Submit'}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={toggleRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      className={`relative h-14 w-14 ${isRecording ? 'animate-pulse border-red-500' : 'hover:border-tutor-purple/60'}`}
                      disabled={isLoading}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="h-5 w-5" />
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                          <span className="absolute -bottom-8 text-xs whitespace-nowrap">
                            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                          </span>
                        </>
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="hover:border-tutor-purple/60 h-14 w-14"
                      disabled={isLoading}
                    >
                      <Image className="h-5 w-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </Button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UnifiedSearch;
