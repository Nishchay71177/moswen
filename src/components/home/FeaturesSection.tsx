
import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-tutor-blue/10 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tutor-blue"><path d="M12 22v-5"></path><path d="M9 8V2.93a2.92 2.92 0 0 1 5.84 0V8"></path><path d="M19 8a7 7 0 0 1-14 0"></path><path d="M12 17v-2"></path></svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Step-by-Step Solutions</h3>
            <p className="text-gray-600 dark:text-gray-300">Get detailed explanations and learn the concepts behind the solution.</p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-tutor-purple/10 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tutor-purple"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Answers</h3>
            <p className="text-gray-600 dark:text-gray-300">No waiting - get solutions in seconds to any math problem.</p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-tutor-orange/10 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tutor-orange"><path d="M5 6h14M5 12h14M5 18h14"></path></svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Formula Reference</h3>
            <p className="text-gray-600 dark:text-gray-300">Access a comprehensive library of mathematical formulas.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
