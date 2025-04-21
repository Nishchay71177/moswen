
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Upload, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface InputMethodsProps {
  onSubmitQuestion: (question: string, inputType: 'text' | 'voice' | 'image') => void;
  isLoading: boolean;
}

const InputMethods: React.FC<InputMethodsProps> = ({ onSubmitQuestion, isLoading }) => {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recordingTimer, setRecordingTimer] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  // Clean up recording timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        window.clearTimeout(recordingTimer);
      }
    };
  }, [recordingTimer]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && !isLoading) {
      onSubmitQuestion(textInput, 'text');
      setTextInput('');
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
      // In a real app, we would implement speech recognition here
      setIsRecording(true);
      setRecordingTime(0);
      
      toast.info("Recording started. Speak clearly...");
      
      // Start a timer to display recording time
      const timerInterval = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Auto-stop after 12 seconds in case user forgets
      const timeout = window.setTimeout(() => {
        if (isRecording) {
          window.clearInterval(timerInterval);
          stopRecording();
          toast.info("Recording stopped automatically");
        }
      }, 12000);
      
      setRecordingTimer(timeout);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Could not start recording. Please check your microphone permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    // Clear timeout if it exists
    if (recordingTimer) {
      window.clearTimeout(recordingTimer);
      setRecordingTimer(null);
    }
    
    // In a real app, we would stop the recording and process the audio
    setIsRecording(false);
    toast.success("Processing your question...");
    
    // For demo purposes, we'll simulate processing and submitting
    // In a real app, this would connect to a speech-to-text service
    setTimeout(() => {
      const simulatedTranscript = "What is the process of photosynthesis?";
      setTextInput(simulatedTranscript); // Set it in the text field for user to edit if needed
      // onSubmitQuestion(simulatedTranscript, 'voice');
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Please upload an image less than 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSubmit = () => {
    if (uploadedImage && !isLoading) {
      toast.info("Analyzing your image...");
      onSubmitQuestion(uploadedImage, 'image');
      setUploadedImage(null);
    }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold mb-6">Ask Your Question</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Text Input */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-xl">Type Your Question</h3>
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <Textarea
              placeholder="E.g., What is the formula for the area of a circle?"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[120px] text-lg font-medium"
            />
            <Button 
              type="submit" 
              className="w-full bg-tutor-blue hover:bg-tutor-blue/90 text-lg py-6"
              disabled={!textInput.trim() || isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit Question'}
              <Send className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </Card>

        {/* Voice and Image Input */}
        <div className="space-y-6">
          {/* Voice Input */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-xl">Use Voice Input</h3>
            <div className="text-center py-4">
              <Button
                type="button"
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "outline"}
                size="lg"
                className={`rounded-full p-6 ${isRecording ? 'animate-pulse' : ''} relative`}
                disabled={isLoading}
              >
                {isRecording ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
                {isRecording && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </Button>
              <p className="mt-3 text-lg font-medium">
                {isRecording ? (
                  <>
                    Recording: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                  </>
                ) : 'Tap to start recording'}
              </p>
            </div>
          </Card>

          {/* Image Upload */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-xl">Upload an Image</h3>
            
            {uploadedImage ? (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded question" 
                    className="w-full h-auto rounded-md object-contain max-h-[200px]" 
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={clearUploadedImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleImageSubmit} 
                  className="w-full bg-tutor-orange hover:bg-tutor-orange/90 text-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Analyze Image'}
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mx-auto text-lg"
                  disabled={isLoading}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Image
                </Button>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  Upload an image of your question or problem
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InputMethods;
