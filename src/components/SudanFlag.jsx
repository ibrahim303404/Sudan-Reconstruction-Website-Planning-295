import React from 'react';
import { motion } from 'framer-motion';

const SudanFlag = ({ className = "w-16 h-12" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`${className} relative rounded-lg overflow-hidden shadow-lg border-2 border-gray-200`}
    >
      {/* Red stripe */}
      <div className="h-1/3 bg-red-600"></div>
      
      {/* White stripe */}
      <div className="h-1/3 bg-white"></div>
      
      {/* Black stripe */}
      <div className="h-1/3 bg-black"></div>
      
      {/* Green triangle */}
      <div 
        className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-b-[24px] border-r-[32px] border-t-transparent border-b-transparent border-r-green-600"
        style={{
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: '#16a34a'
        }}
      ></div>
    </motion.div>
  );
};

export default SudanFlag;