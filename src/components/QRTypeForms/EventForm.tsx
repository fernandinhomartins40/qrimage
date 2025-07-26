import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EventContent } from '@/types/qr-types';

interface EventFormProps {
  data: EventContent;
  onChange: (data: EventContent) => void;
}

export function EventForm({ 
  data = { 
    title: '', 
    startDate: '', 
    endDate: '', 
    location: '', 
    description: '' 
  }, 
  onChange 
}: EventFormProps) {
  const handleChange = (field: keyof EventContent, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-sm font-medium">
          Título do Evento *
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Reunião de Equipe"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate" className="text-sm font-medium">
            Data/Hora de Início *
          </Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={data.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="endDate" className="text-sm font-medium">
            Data/Hora de Fim
          </Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={data.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location" className="text-sm font-medium">
          Local do Evento
        </Label>
        <Input
          id="location"
          type="text"
          placeholder="Sala de Reuniões A, 2º andar"
          value={data.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-medium">
          Descrição
        </Label>
        <Textarea
          id="description"
          placeholder="Descrição detalhada do evento..."
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="mt-1 min-h-[100px]"
        />
      </div>
    </div>
  );
}