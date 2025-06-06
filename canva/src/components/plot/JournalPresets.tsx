
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { JOURNAL_PRESETS } from '@/lib/plotDefaults';

interface JournalPresetsProps {
  onSelect: (presetId: string) => void;
}

const JournalPresets = ({ onSelect }: JournalPresetsProps) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Journal Presets</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Publication Ready</span>
          </div>
          
          <Select onValueChange={onSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select journal style" />
            </SelectTrigger>
            <SelectContent>
              {JOURNAL_PRESETS.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* <div className="text-xs text-gray-500">
            These presets configure font size, colors, and dimensions according to common journal requirements.
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalPresets;
