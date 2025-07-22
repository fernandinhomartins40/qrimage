import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { AppHeader } from '@/components/Header/AppHeader';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <QRCodeGenerator />
    </div>
  );
};

export default Index;
