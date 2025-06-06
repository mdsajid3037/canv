
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PlotConfig } from '@/lib/plotDefaults';

interface SettingsDialogProps {
  config: PlotConfig;
  updateConfig: (updates: Partial<PlotConfig>) => void;
}

const SettingsDialog = ({ config, updateConfig }: SettingsDialogProps) => {
  const exportFormats = [
    { value: 'png', label: 'PNG Image' },
    { value: 'svg', label: 'SVG Vector' },
    { value: 'pdf', label: 'PDF Document' },
  ];

  return (
    <div className="space-y-6">
      {/* Display Options */}
      <div className="space-y-4">
     
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-grid">Show Grid</Label>
          <Switch
            id="show-grid"
            checked={config.showGrid}
            onCheckedChange={(checked) => updateConfig({ showGrid: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-legend">Show Legend</Label>
          <Switch
            id="show-legend"
            checked={config.showLegend}
            onCheckedChange={(checked) => updateConfig({ showLegend: checked })}
          />
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        
        <div className="space-y-1">
          <Label>Font Size: {config.fontSize}px</Label>
          <Slider
            value={[config.fontSize]}
            onValueChange={([value]) => updateConfig({ fontSize: value })}
            min={8}
            max={20}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Title Size: {config.titleSize}px</Label>
          <Slider
            value={[config.titleSize]}
            onValueChange={([value]) => updateConfig({ titleSize: value })}
            min={12}
            max={32}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Line Properties */}
      <div className="space-y-4">
       
        
        <div className="space-y-2">
          <Label>Line Width: {config.lineWidth}px</Label>
          <Slider
            value={[config.lineWidth]}
            onValueChange={([value]) => updateConfig({ lineWidth: value })}
            min={0.5}
            max={5}
            step={0.5}
            className="w-full"
          />
        </div>
      </div>

      {/* Export Settings */}
      <div className="space-y-4">
    
        <div className="space-y-2">
          <Label>Default Export Format</Label>
          <Select defaultValue="png">
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {exportFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
