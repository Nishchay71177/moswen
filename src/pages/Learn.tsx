
import React, { useState } from 'react';
import TutorHeader from '@/components/TutorHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, BookText, Calculator, ChevronRight, Crown, GraduationCap, Home, PlayCircle, Star } from 'lucide-react';

const LearnPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('algebra');

  const categories = [
    { id: 'algebra', name: 'Algebra', icon: <Calculator className="h-5 w-5" /> },
    { id: 'calculus', name: 'Calculus', icon: <GraduationCap className="h-5 w-5" /> },
    { id: 'geometry', name: 'Geometry', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'statistics', name: 'Statistics', icon: <BookText className="h-5 w-5" /> },
  ];

  const resources = {
    algebra: [
      {
        title: 'Linear Equations',
        description: 'Master the fundamentals of solving linear equations.',
        difficulty: 'Beginner',
        time: '20 min',
        isPremium: false,
        image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        title: 'Quadratic Functions',
        description: 'Learn how to solve and graph quadratic equations.',
        difficulty: 'Intermediate',
        time: '35 min',
        isPremium: false,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        title: 'Systems of Equations',
        description: 'Advanced techniques for solving multiple equations simultaneously.',
        difficulty: 'Advanced',
        time: '45 min',
        isPremium: true,
        image: 'https://images.unsplash.com/photo-1629752187687-3d3d752e7f28?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
    ],
    calculus: [
      {
        title: 'Limits & Continuity',
        description: 'Understanding the foundation of calculus.',
        difficulty: 'Intermediate',
        time: '30 min',
        isPremium: false,
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        title: 'Derivatives',
        description: 'Learn how to find the rate of change of functions.',
        difficulty: 'Intermediate',
        time: '40 min',
        isPremium: false,
        image: 'https://images.unsplash.com/photo-1612212909979-51fa9748bd7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        title: 'Integration Techniques',
        description: 'Master advanced methods of integration.',
        difficulty: 'Advanced',
        time: '50 min',
        isPremium: true,
        image: 'https://images.unsplash.com/photo-1580894908361-967195033215?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
    ],
    geometry: [
      {
        title: 'Euclidean Geometry',
        description: 'Explore the fundamentals of plane geometry.',
        difficulty: 'Beginner',
        time: '25 min',
        isPremium: false,
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        title: 'Trigonometry',
        description: 'Understanding angles, triangles and trigonometric functions.',
        difficulty: 'Intermediate',
        time: '35 min',
        isPremium: false,
        image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        title: 'Non-Euclidean Geometry',
        description: 'Explore geometric concepts beyond traditional Euclidean space.',
        difficulty: 'Advanced',
        time: '55 min',
        isPremium: true,
        image: 'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
    ],
    statistics: [
      {
        title: 'Descriptive Statistics',
        description: 'Learn how to summarize and visualize data.',
        difficulty: 'Beginner',
        time: '20 min',
        isPremium: false,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        title: 'Probability Distributions',
        description: 'Understanding normal, binomial, and other distributions.',
        difficulty: 'Intermediate',
        time: '40 min',
        isPremium: false,
        image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        title: 'Hypothesis Testing',
        description: 'Advanced statistical inference techniques.',
        difficulty: 'Advanced',
        time: '45 min',
        isPremium: true,
        image: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
    ],
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <TutorHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold tutor-gradient-text"
          >
            Math Learning Center
          </motion.h1>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>

        <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 bg-transparent">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-tutor-purple data-[state=active]:text-white data-[state=active]:shadow-md flex items-center gap-2 px-4 py-2"
                >
                  {category.icon}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(resources).map(([key, items]) => (
            <TabsContent key={key} value={key}>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {items.map((resource, index) => (
                  <motion.div key={index} variants={item}>
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 border-gray-200 dark:border-gray-700">
                      <div className="relative h-40 overflow-hidden">
                        <img 
                          src={resource.image} 
                          alt={resource.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                        />
                        {resource.isPremium && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <Crown className="h-3 w-3 mr-1" />
                            <span>Premium</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <div className="flex items-center text-white text-xs space-x-2">
                            <span className="bg-white/20 px-2 py-0.5 rounded-full">{resource.difficulty}</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded-full flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                              <span className="ml-1">{resource.time}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button 
                          variant={resource.isPremium ? "default" : "outline"} 
                          className={`w-full ${resource.isPremium ? 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700' : ''}`}
                        >
                          {resource.isPremium ? (
                            <>
                              <Star className="h-4 w-4 mr-1" /> Unlock Premium
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4 mr-1" /> Start Learning
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-tutor-blue/10 to-tutor-purple/10 rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h2 className="text-2xl font-bold mb-2">Ready to Master Math?</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-lg">
                Get unlimited access to all premium courses, practice problems, and step-by-step solutions with our Premium subscription.
              </p>
            </div>
            <Button className="bg-gradient-to-r from-tutor-blue to-tutor-purple hover:opacity-90 text-white">
              Explore Premium <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default LearnPage;
