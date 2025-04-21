
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface ScrollIndicatorProps {
  show: boolean;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ show }) => {
  if (!show) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ArrowDown className="h-6 w-6 text-tutor-purple/70" />
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;
