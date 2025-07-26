import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from '@/components/Header/AppHeader';
import { QRTypeSelector } from '@/components/QRTypeSelector';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { QRCodeType } from '@/types/qr-types';

const Index = () => {
  const [selectedType, setSelectedType] = useState<QRCodeType>('url');
  const [showGenerator, setShowGenerator] = useState(false);

  const handleTypeSelect = (type: QRCodeType) => {
    setSelectedType(type);
    setShowGenerator(true);
  };

  const handleBackToSelector = () => {
    setShowGenerator(false);
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <AnimatePresence mode="wait">
        {!showGenerator ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <QRTypeSelector 
              selectedType={selectedType}
              onTypeSelect={handleTypeSelect}
            />
          </motion.div>
        ) : (
          <motion.div
            key="generator"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
          >
            <QRCodeGenerator 
              qrType={selectedType}
              onTypeChange={handleBackToSelector}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;