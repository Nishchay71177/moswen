
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { groqService } from '@/services/GroqService';
import { useToast } from '@/components/ui/use-toast';

const PracticeQuestions = () => {
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateQuestion = async (searchTopic?: string) => {
    setIsLoading(true);
    try {
      const prompt = `Generate a challenging mathematics question ${searchTopic ? `about ${searchTopic}` : ''} suitable for practice. The question should be clear and concise.`;
      const response = await groqService.generateAnswer(prompt, 'mathematics', 'text');
      setQuestion(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    generateQuestion(topic);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search topic (e.g., algebra, calculus)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      <div className="min-h-[200px] p-6 rounded-lg border bg-card text-card-foreground">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse">Generating question...</div>
          </div>
        ) : question ? (
          <div className="space-y-4">
            <p className="text-lg">{question}</p>
            <Button onClick={() => generateQuestion(topic)}>
              Generate New Question
            </Button>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No question generated yet</p>
            <Button onClick={() => generateQuestion()} className="mt-2">
              Generate Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeQuestions;
