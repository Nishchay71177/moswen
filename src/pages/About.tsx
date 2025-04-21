
import React from 'react';
import TutorHeader from '@/components/TutorHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowRight, Github, Twitter, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TutorHeader />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold tutor-gradient-text"
          >
            About Moswen Math Solver
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

        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={item}>
              <Card className="overflow-hidden border-tutor-purple/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="h-40 bg-gradient-to-r from-tutor-blue/20 to-tutor-purple/20 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, rotate: -5 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.3
                    }}
                    className="text-6xl font-bold tutor-gradient-text"
                  >
                    Our Mission
                  </motion.div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Moswen Math Solver is designed to help students learn mathematics by providing 
                    step-by-step solutions to a wide range of mathematical problems. Our AI-powered
                    tutor breaks down complex problems into understandable steps, making learning
                    more accessible and effective for students of all levels.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We believe that everyone deserves access to quality education, and our platform
                    is designed to democratize mathematical learning by providing instant, personalized help
                    whenever students need it most.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-tutor-purple/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-semibold text-tutor-blue">How It Works</h2>
                  <div className="grid md:grid-cols-3 gap-6 mt-4">
                    <div className="bg-tutor-blue/10 p-5 rounded-lg relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-tutor-blue rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <h3 className="text-lg font-medium mt-4 mb-2">Ask a Question</h3>
                      <p className="text-gray-600 dark:text-gray-400">Type your math problem, upload an image, or use voice input to describe what you need help with.</p>
                    </div>
                    
                    <div className="bg-tutor-purple/10 p-5 rounded-lg relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-tutor-purple rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <h3 className="text-lg font-medium mt-4 mb-2">AI Processing</h3>
                      <p className="text-gray-600 dark:text-gray-400">Our advanced AI analyzes your problem and generates a comprehensive, step-by-step solution.</p>
                    </div>
                    
                    <div className="bg-tutor-orange/10 p-5 rounded-lg relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-tutor-orange rounded-full flex items-center justify-center text-white font-bold">3</div>
                      <h3 className="text-lg font-medium mt-4 mb-2">Learn & Understand</h3>
                      <p className="text-gray-600 dark:text-gray-400">Review the detailed explanation to understand the concepts and methodology behind the solution.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-tutor-purple/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-semibold text-tutor-blue">Features</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 w-5 h-5 bg-gradient-to-r from-tutor-blue to-tutor-purple rounded-full flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Step-by-step solutions for various math topics</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 w-5 h-5 bg-gradient-to-r from-tutor-blue to-tutor-purple rounded-full flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Multiple input methods (text, voice, image)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 w-5 h-5 bg-gradient-to-r from-tutor-blue to-tutor-purple rounded-full flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Mathematical formula reference library</span>
                      </li>
                    </ul>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 w-5 h-5 bg-gradient-to-r from-tutor-blue to-tutor-purple rounded-full flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Interactive practice worksheets</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 w-5 h-5 bg-gradient-to-r from-tutor-blue to-tutor-purple rounded-full flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Personal history tracking</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1 mr-3 w-5 h-5 bg-gradient-to-r from-tutor-blue to-tutor-purple rounded-full flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Comprehensive learning resources</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-tutor-purple/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-semibold text-tutor-blue">Technology</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Moswen Math Solver is built using React and Tailwind CSS for the frontend,
                    with Supabase providing backend functionality. Our AI solutions are powered
                    by Groq's advanced large language models, specifically optimized for
                    mathematical problem-solving.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">Tailwind CSS</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">Supabase</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Groq AI</span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Framer Motion</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-tutor-purple/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-tutor-blue mb-4">Connect With Us</h2>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub
                    </Button>
                    <Button variant="outline" className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </Button>
                    <Button variant="outline" className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <footer className="bg-gray-50 dark:bg-gray-900 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Moswen Math Solver. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
