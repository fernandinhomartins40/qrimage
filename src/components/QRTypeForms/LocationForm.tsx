import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LocationContent } from '@/types/qr-types';
import { MapPin } from 'lucide-react';

interface LocationFormProps {
  data: LocationContent;
  onChange: (data: LocationContent) => void;
}

export function LocationForm({ 
  data = { latitude: 0, longitude: 0, name: '' }, 
  onChange 
}: LocationFormProps) {
  const handleChange = (field: keyof LocationContent, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onChange({
            ...data,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    } else {
      alert('Geolocalização não é suportada neste navegador');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-sm font-medium">
          Nome do Local
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Shopping Center ABC"
          value={data.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude" className="text-sm font-medium">
            Latitude *
          </Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="-23.561414"
            value={data.latitude || ''}
            onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="longitude" className="text-sm font-medium">
            Longitude *
          </Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="-46.625290"
            value={data.longitude || ''}
            onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={getCurrentLocation}
        className="w-full"
      >
        <MapPin className="mr-2 h-4 w-4" />
        Usar Minha Localização Atual
      </Button>

      <p className="text-xs text-muted-foreground">
        As coordenadas podem ser obtidas no Google Maps clicando com o botão direito em um local
      </p>
    </div>
  );
}