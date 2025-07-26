import { useState } from 'react';
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
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        {!showGenerator ? (
          <QRTypeSelector 
            selectedType={selectedType}
            onTypeSelect={handleTypeSelect}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToSelector}
                className="text-primary hover:text-primary/80 flex items-center gap-2"
              >
                ← Voltar para seleção de tipos
              </button>
            </div>
            <QRCodeGenerator 
              qrType={selectedType}
              onTypeChange={handleBackToSelector}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
