
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PLOT_TYPES, PlotType } from '@/lib/plotDefaults';

interface PlotTypeSelectorProps {
  value: PlotType;
  onChange: (type: PlotType) => void;
}

const PlotTypeSelector = ({ value, onChange }: PlotTypeSelectorProps) => {
  // Group plot types by category
  const categorizedTypes = PLOT_TYPES.reduce((acc, plotType) => {
    if (!acc[plotType.category]) {
      acc[plotType.category] = [];
    }
    acc[plotType.category].push(plotType);
    return acc;
  }, {} as Record<string, typeof PLOT_TYPES>);

  const currentPlotType = PLOT_TYPES.find(type => type.value === value);

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 shadow-md border-0">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-science-800">Graph Type</h3>
          
          <Select 
            value={value} 
            onValueChange={(value) => onChange(value as PlotType)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select plot type" />
            </SelectTrigger>
            <SelectContent className="max-h-96 overflow-y-auto">
              {Object.entries(categorizedTypes).map(([category, types]) => (
                <div key={category}>
                  <div className="px-2 py-1 text-sm font-semibold text-gray-600 bg-gray-100">
                    {category}
                  </div>
                  {types.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="pl-4">
                      {type.label}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
          
          {currentPlotType && (
            <div className="mt-4 p-3 bg-science-50 rounded-lg border border-science-200">
              <div className="text-sm font-medium text-science-800 mb-1">
                {currentPlotType.category}
              </div>
              <div className="text-sm text-science-600">
                {currentPlotType.label}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlotTypeSelector;
