import { QRCodeType } from '@/types/qr-types';
import { UrlForm } from './UrlForm';
import { TextForm } from './TextForm';
import { WifiForm } from './WifiForm';
import { VCardForm } from './VCardForm';
import { SmsForm } from './SmsForm';
import { WhatsAppForm } from './WhatsAppForm';
import { EmailForm } from './EmailForm';
import { PhoneForm } from './PhoneForm';
import { LocationForm } from './LocationForm';
import { EventForm } from './EventForm';
import { PixForm } from './PixForm';
import { QRSettings } from './QRSettings';

interface QRTypeFormProps {
  type: QRCodeType;
  data: any;
  onChange: (data: any) => void;
  settings: any;
  onSettingsChange: (settings: any) => void;
}

export function QRTypeForm({ type, data, onChange, settings, onSettingsChange }: QRTypeFormProps) {
  const renderForm = () => {
    const commonProps = { data, onChange };

    switch (type) {
      case 'url':
        return <UrlForm {...commonProps} />;
      case 'text':
        return <TextForm {...commonProps} />;
      case 'wifi':
        return <WifiForm {...commonProps} />;
      case 'vcard':
        return <VCardForm {...commonProps} />;
      case 'sms':
        return <SmsForm {...commonProps} />;
      case 'whatsapp':
        return <WhatsAppForm {...commonProps} />;
      case 'email':
        return <EmailForm {...commonProps} />;
      case 'phone':
        return <PhoneForm {...commonProps} />;
      case 'location':
        return <LocationForm {...commonProps} />;
      case 'event':
        return <EventForm {...commonProps} />;
      case 'pix':
        return <PixForm {...commonProps} />;
      default:
        return <div>Tipo de QR não suportado: {type}</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Type-specific form */}
      {renderForm()}
      
      {/* QR Settings */}
      <QRSettings 
        settings={settings} 
        onChange={onSettingsChange} 
      />
    </div>
  );
}