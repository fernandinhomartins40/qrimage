// QR Code generation utilities for different types
import QRCode from 'qrcode';
import { 
  QRCodeType, 
  UrlContent, 
  TextContent, 
  WifiContent, 
  VCardContent, 
  SmsContent, 
  WhatsAppContent, 
  EmailContent, 
  PhoneContent, 
  LocationContent, 
  EventContent, 
  PixContent 
} from '@/types/qr-types';

// Generate QR data string based on type and content
export function generateQRData(type: QRCodeType, content: any): string {
  switch (type) {
    case 'url':
      return generateUrlData(content as UrlContent);
    case 'text':
      return generateTextData(content as TextContent);
    case 'wifi':
      return generateWifiData(content as WifiContent);
    case 'vcard':
      return generateVCardData(content as VCardContent);
    case 'sms':
      return generateSmsData(content as SmsContent);
    case 'whatsapp':
      return generateWhatsAppData(content as WhatsAppContent);
    case 'email':
      return generateEmailData(content as EmailContent);
    case 'phone':
      return generatePhoneData(content as PhoneContent);
    case 'location':
      return generateLocationData(content as LocationContent);
    case 'event':
      return generateEventData(content as EventContent);
    case 'pix':
      return generatePixData(content as PixContent);
    default:
      throw new Error(`Unsupported QR type: ${type}`);
  }
}

// Individual generators for each type
function generateUrlData(content: UrlContent): string {
  // Ensure URL has protocol
  let url = content.url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
}

function generateTextData(content: TextContent): string {
  return content.text;
}

function generateWifiData(content: WifiContent): string {
  const { ssid, password, security, hidden = false } = content;
  return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
}

function generateVCardData(content: VCardContent): string {
  const { firstName, lastName, organization, phone, email, url, address } = content;
  
  let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
  vcard += `FN:${firstName} ${lastName}\n`;
  vcard += `N:${lastName};${firstName};;;\n`;
  
  if (organization) vcard += `ORG:${organization}\n`;
  if (phone) vcard += `TEL:${phone}\n`;
  if (email) vcard += `EMAIL:${email}\n`;
  if (url) vcard += `URL:${url}\n`;
  if (address) vcard += `ADR:;;${address};;;;\n`;
  
  vcard += 'END:VCARD';
  return vcard;
}

function generateSmsData(content: SmsContent): string {
  return `sms:${content.phone}?body=${encodeURIComponent(content.message)}`;
}

function generateWhatsAppData(content: WhatsAppContent): string {
  // Remove non-digits and ensure country code format
  const cleanPhone = content.phone.replace(/\D/g, '');
  const message = encodeURIComponent(content.message);
  return `https://wa.me/${cleanPhone}?text=${message}`;
}

function generateEmailData(content: EmailContent): string {
  let mailto = `mailto:${content.email}`;
  const params = [];
  
  if (content.subject) params.push(`subject=${encodeURIComponent(content.subject)}`);
  if (content.body) params.push(`body=${encodeURIComponent(content.body)}`);
  
  if (params.length > 0) {
    mailto += '?' + params.join('&');
  }
  
  return mailto;
}

function generatePhoneData(content: PhoneContent): string {
  return `tel:${content.phone}`;
}

function generateLocationData(content: LocationContent): string {
  const { latitude, longitude, name } = content;
  if (name) {
    return `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`;
  }
  return `geo:${latitude},${longitude}`;
}

function generateEventData(content: EventContent): string {
  const { title, startDate, endDate, location, description } = content;
  
  // Convert to UTC format for calendar
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  let vevent = 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n';
  vevent += `SUMMARY:${title}\n`;
  vevent += `DTSTART:${formatDate(startDate)}\n`;
  
  if (endDate) {
    vevent += `DTEND:${formatDate(endDate)}\n`;
  }
  if (location) {
    vevent += `LOCATION:${location}\n`;
  }
  if (description) {
    vevent += `DESCRIPTION:${description}\n`;
  }
  
  vevent += 'END:VEVENT\nEND:VCALENDAR';
  return vevent;
}

function generatePixData(content: PixContent): string {
  const { key, name, city, amount, description } = content;
  
  // Simplified PIX QR format (EMV standard would be more complex)
  // For now, we'll use a basic format that most PIX apps can interpret
  let pixData = `00020101021226${key.length.toString().padStart(2, '0')}${key}`;
  pixData += `52040000530398654${amount ? amount.toFixed(2) : '0.00'}`;
  pixData += `59${name.length.toString().padStart(2, '0')}${name}`;
  pixData += `60${city.length.toString().padStart(2, '0')}${city}`;
  
  if (description) {
    pixData += `62${description.length.toString().padStart(2, '0')}${description}`;
  }
  
  return pixData;
}

// Generate QR code image
export async function generateQRImage(
  data: string,
  options: {
    color?: string;
    backgroundColor?: string;
    size?: number;
    margin?: number;
  } = {}
): Promise<string> {
  const qrOptions = {
    color: {
      dark: options.color || '#000000',
      light: options.backgroundColor || '#FFFFFF'
    },
    width: options.size || 256,
    margin: options.margin || 4,
    errorCorrectionLevel: 'M' as const
  };
  
  try {
    return await QRCode.toDataURL(data, qrOptions);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

// Validate content for each type
export function validateQRContent(type: QRCodeType, content: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  switch (type) {
    case 'url':
      if (!content.url || content.url.trim() === '') {
        errors.push('URL é obrigatória');
      }
      break;
      
    case 'text':
      if (!content.text || content.text.trim() === '') {
        errors.push('Texto é obrigatório');
      }
      break;
      
    case 'wifi':
      if (!content.ssid || content.ssid.trim() === '') {
        errors.push('Nome da rede (SSID) é obrigatório');
      }
      if (content.security !== 'nopass' && (!content.password || content.password.trim() === '')) {
        errors.push('Senha é obrigatória para redes protegidas');
      }
      break;
      
    case 'vcard':
      if (!content.firstName || content.firstName.trim() === '') {
        errors.push('Nome é obrigatório');
      }
      if (!content.lastName || content.lastName.trim() === '') {
        errors.push('Sobrenome é obrigatório');
      }
      break;
      
    case 'sms':
    case 'whatsapp':
    case 'phone':
      if (!content.phone || content.phone.trim() === '') {
        errors.push('Número de telefone é obrigatório');
      }
      if ((type === 'sms' || type === 'whatsapp') && (!content.message || content.message.trim() === '')) {
        errors.push('Mensagem é obrigatória');
      }
      break;
      
    case 'email':
      if (!content.email || content.email.trim() === '') {
        errors.push('Email é obrigatório');
      }
      if (content.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email)) {
        errors.push('Email inválido');
      }
      break;
      
    case 'location':
      if (content.latitude === undefined || content.longitude === undefined) {
        errors.push('Coordenadas são obrigatórias');
      }
      break;
      
    case 'event':
      if (!content.title || content.title.trim() === '') {
        errors.push('Título do evento é obrigatório');
      }
      if (!content.startDate) {
        errors.push('Data de início é obrigatória');
      }
      break;
      
    case 'pix':
      if (!content.key || content.key.trim() === '') {
        errors.push('Chave PIX é obrigatória');
      }
      if (!content.name || content.name.trim() === '') {
        errors.push('Nome do beneficiário é obrigatório');
      }
      if (!content.city || content.city.trim() === '') {
        errors.push('Cidade é obrigatória');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}