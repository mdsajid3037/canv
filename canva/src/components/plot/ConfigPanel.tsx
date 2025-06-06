
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PlotConfig, FONT_FAMILIES } from '@/lib/plotDefaults';

interface ConfigPanelProps {
  config: PlotConfig;
  updateConfig: (updates: Partial<PlotConfig>) => void;
}

const ConfigPanel = ({ config, updateConfig }: ConfigPanelProps) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Plot Configuration</h3>
            
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={config.title} 
                  onChange={(e) => updateConfig({ title: e.target.value })} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="xLabel">X Axis Label</Label>
                  <Input 
                    id="xLabel" 
                    value={config.xLabel} 
                    onChange={(e) => updateConfig({ xLabel: e.target.value })} 
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="yLabel">Y Axis Label</Label>
                  <Input 
                    id="yLabel" 
                    value={config.yLabel} 
                    onChange={(e) => updateConfig({ yLabel: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
        
            <div className="space-y-4">
              <div className="grid gap-0.5">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select 
                  value={config.fontFamily} 
                  onValueChange={(value) => updateConfig({ fontFamily: value })}
                >
                  <SelectTrigger id="fontFamily">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <span className="text-sm text-gray-500">{config.fontSize}pt</span>
                </div>
                <Slider
                  id="fontSize"
                  min={6}
                  max={18}
                  step={1}
                  value={[config.fontSize]}
                  onValueChange={(value) => updateConfig({ fontSize: value[0] })}
                />
              </div>
               */}
              {/* <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="lineWidth">Line Width</Label>
                  <span className="text-sm text-gray-500">{config.lineWidth}px</span>
                </div>
                <Slider
                  id="lineWidth"
                  min={0.5}
                  max={5}
                  step={0.5}
                  value={[config.lineWidth]}
                  onValueChange={(value) => updateConfig({ lineWidth: value[0] })}
                />
              </div> */}
            </div>
          </div>
          
          {/* <div>
            <h3 className="text-sm font-medium uppercase text-gray-500 mb-3">Display</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showLegend" className="cursor-pointer">Show Legend</Label>
                <Switch 
                  id="showLegend" 
                  checked={config.showLegend}
                  onCheckedChange={(checked) => updateConfig({ showLegend: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="showGrid" className="cursor-pointer">Show Grid</Label>
                <Switch 
                  id="showGrid" 
                  checked={config.showGrid}
                  onCheckedChange={(checked) => updateConfig({ showGrid: checked })}
                />
              </div>
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigPanel;
