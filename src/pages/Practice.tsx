
import React from 'react';
import TutorHeader from '@/components/TutorHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PracticeQuestions from '@/components/PracticeQuestions';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const PracticePage = () => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TutorHeader />
          <main className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold tutor-gradient-text">
                Practice Mathematics
              </h1>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>

            <Card className="max-w-3xl mx-auto bg-white/50 backdrop-blur border-tutor-purple/20 p-6">
              <PracticeQuestions />
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PracticePage;
