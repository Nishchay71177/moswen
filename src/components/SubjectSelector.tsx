import React, { useState, useRef } from 'react';
import { Calculator, Puzzle, Sigma, Pi, Circle, SquareEqual, Send, Mic, MicOff, Image, X, Infinity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SubjectCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  onSubmitQuestion: (question: string, inputType: 'text' | 'voice' | 'image', subject: string, isComplex?: boolean) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  icon, 
  title, 
  description, 
  isActive, 
  onClick,
  onSubmitQuestion 
}) => {
  const [question, setQuestion] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    onClick();
    setExpanded(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmitQuestion(question, 'text', title.toLowerCase());
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
      console.log('Recording started...');
      toast.info('Voice recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    console.log('Recording stopped. Processing audio...');
    toast.info('Processing voice input...');
    
    setTimeout(() => {
      const simulatedTranscript = `What is the derivative of x² in ${title}?`;
      onSubmitQuestion(simulatedTranscript, 'voice', title.toLowerCase());
      toast.success('Voice processed successfully');
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const handleImageSubmit = () => {
    if (uploadedImage) {
      onSubmitQuestion(uploadedImage, 'image', title.toLowerCase());
      setUploadedImage(null);
      toast.success('Image submitted for analysis');
    }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      className={`tutor-card cursor-pointer ${
        isActive 
          ? 'ring-2 ring-tutor-purple bg-tutor-lightPurple/10' 
          : 'hover:border-tutor-lightPurple'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div 
          className={`p-3 rounded-full mb-4 ${isActive ? 'bg-tutor-purple text-white' : 'bg-gray-100'}`}
          onClick={handleClick}
        >
          {icon}
        </div>
        <h3 className="font-bold text-lg mb-2" onClick={handleClick}>{title}</h3>
        <p className="text-gray-600 text-sm mb-4" onClick={handleClick}>{description}</p>
        
        {isActive && (
          <div className="w-full mt-2">
            {uploadedImage ? (
              <div className="space-y-4 mb-4">
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded question" 
                    className="w-full h-auto rounded-md object-contain max-h-[200px]" 
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={clearUploadedImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleImageSubmit} 
                    className="w-full bg-tutor-orange hover:bg-tutor-orange/90"
                  >
                    Analyze Image
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Card>
                  <CardContent className="p-2">
                    <p className="text-sm text-gray-500 mb-2">Ask a question about {title}</p>
                    <Textarea
                      placeholder={`Ask your ${title} question here...`}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="min-h-[80px] mb-2 text-sm"
                    />
                  </CardContent>
                </Card>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-tutor-blue hover:bg-tutor-blue/90"
                    disabled={!question.trim()}
                  >
                    Submit
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={toggleRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      className={`${isRecording ? 'animate-pulse' : ''}`}
                      size="icon"
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Image className="h-4 w-4" />
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
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface SubjectSelectorProps {
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
  onSubmitQuestion: (question: string, inputType: 'text' | 'voice' | 'image', subject: string, isComplex?: boolean) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ 
  selectedSubject, 
  onSelectSubject,
  onSubmitQuestion
}) => {
  const subjects = [
    {
      id: 'algebra',
      title: 'Algebra',
      description: 'Equations, inequalities, functions and graphs',
      icon: <Calculator className="h-6 w-6" />
    },
    {
      id: 'geometry',
      title: 'Geometry',
      description: 'Shapes, angles, areas and transformations',
      icon: <Circle className="h-6 w-6" />
    },
    {
      id: 'calculus',
      title: 'Calculus',
      description: 'Limits, derivatives, integrals and applications',
      icon: <Sigma className="h-6 w-6" />
    },
    {
      id: 'trigonometry',
      title: 'Trigonometry',
      description: 'Angles, triangles, sine, cosine and tangent',
      icon: <Pi className="h-6 w-6" />
    },
    {
      id: 'statistics',
      title: 'Statistics',
      description: 'Data analysis, probability and distributions',
      icon: <SquareEqual className="h-6 w-6" />
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      description: 'Word problems, logic and mathematical reasoning',
      icon: <Puzzle className="h-6 w-6" />
    },
    {
      id: 'advanced-mathematics',
      title: 'Advanced Mathematics',
      description: 'Higher-level concepts like number theory, abstract algebra, and advanced calculus',
      icon: <Infinity className="h-6 w-6" />
    },
  ];

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Select a Math Topic</h2>
      <ScrollArea className="h-[500px] rounded-md border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              icon={subject.icon}
              title={subject.title}
              description={subject.description}
              isActive={selectedSubject === subject.id}
              onClick={() => onSelectSubject(subject.id)}
              onSubmitQuestion={onSubmitQuestion}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SubjectSelector;
