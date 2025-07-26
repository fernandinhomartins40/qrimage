// Types for QR Code system
export type QRCodeType = 
  | 'url'
  | 'text' 
  | 'wifi'
  | 'vcard'
  | 'sms'
  | 'whatsapp'
  | 'email'
  | 'phone'
  | 'location'
  | 'event'
  | 'pix';

export interface QRCodeConfig {
  type: QRCodeType;
  content: any;
  settings: {
    color?: string;
    backgroundColor?: string;
    logo?: string;
    size?: number;
    margin?: number;
  };
}

// Content interfaces for each QR type
export interface UrlContent {
  url: string;
  title?: string;
}

export interface TextContent {
  text: string;
}

export interface WifiContent {
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export interface VCardContent {
  firstName: string;
  lastName: string;
  organization?: string;
  phone?: string;
  email?: string;
  url?: string;
  address?: string;
}

export interface SmsContent {
  phone: string;
  message: string;
}

export interface WhatsAppContent {
  phone: string;
  message: string;
}

export interface EmailContent {
  email: string;
  subject?: string;
  body?: string;
}

export interface PhoneContent {
  phone: string;
}

export interface LocationContent {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface EventContent {
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
}

export interface PixContent {
  key: string;
  name: string;
  city: string;
  amount?: number;
  description?: string;
}