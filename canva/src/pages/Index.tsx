
import Layout from '@/components/layout/Layout';
import ConfigPanel from '@/components/plot/ConfigPanel';
import DataTable from '@/components/plot/DataTable';
import GraphPreview from '@/components/plot/GraphPreview';
import JournalPresets from '@/components/plot/JournalPresets';
import PlotTypeSelector from '@/components/plot/PlotTypeSelector';
import CSVUpload from '@/components/plot/CSVUpload';
import SettingsDialog from '@/components/settings/SettingsDialog';
import { JOURNAL_PRESETS } from '@/lib/plotDefaults';
import { usePlotConfig } from '@/hooks/usePlotConfig';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
    config,
    data,
    updateConfig,
    updateData,
    addDataPoint,
    removeDataPoint,
    updateDataPoint,
    applyJournalPreset,
    resetToDefault,
    loadExampleData,
    changePlotType,
    loadCSVData,
  } = usePlotConfig();

  const handleJournalPresetSelect = (presetId: string) => {
    const preset = JOURNAL_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      applyJournalPreset(preset);
    }
  };

  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${config.title.replace(/\s+/g, '-').toLowerCase()}-plot.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Export Successful",
        description: "Your scientific plot has been downloaded.",
      });
    } else {
      toast({
        title: "Export Failed",
        description: "No plot available to export.",
        variant: "destructive",
      });
    }
  };

  // Check if user has uploaded CSV data (non-null values exist)
  const hasUploadedData = data.some(point => point.x !== null && point.y !== null);
  
  // Check if data contains example data pattern (specific values that indicate example data)
  const hasExampleData = data.length > 3 && data.some(point => 
    point.x !== null && point.y !== null && 
    // Check for typical example data patterns
    (point.x === 1 || point.x === 2 || point.x === 3 || point.x === 4 || point.x === 5)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Layout config={config} updateConfig={updateConfig} onExport={handleExport}>
        {/* <div className="mb-3">
          <h1 className="text-2xl font-bold text-science-800">Sci Plot Canvas</h1>
          <p className="text-gray-600 text-sm mt-1">
            Configure and generate publication-ready scientific plots with ease.
          </p>
        </div> */}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 h-[97vh] max-h-[97vh] overflow-hidden">
          {/* Left side - Settings and Configuration */}
          <div className="xl:col-span-3 space-y-3 overflow-y-auto max-h-full pr-2">
            <div className="bg-white shadow-sm rounded-lg p-3">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-1">
                Settings & Configuration
              </h3>
              <SettingsDialog config={config} updateConfig={updateConfig} />
            </div>
            <div className="h-fit">
              <ConfigPanel config={config} updateConfig={updateConfig} />
            </div>
            <div className="h-fit">
              <JournalPresets onSelect={handleJournalPresetSelect} />
            </div>
          </div>

          {/* Center - Graph Preview */}
          <div className="xl:col-span-6 flex flex-col min-h-0">
            <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm p-2">
              <GraphPreview config={config} data={data} />
            </div>
          </div>

          {/* Right side - Plot Type, Data Upload & Management */}
          <div className="xl:col-span-3 space-y-3 overflow-y-auto max-h-full pr-2">
            <div className="h-fit">
              <PlotTypeSelector value={config.plotType} onChange={changePlotType} />
            </div>
            <div className="h-fit">
              <CSVUpload onDataLoad={loadCSVData} />
            </div>
            
            {/* Show data table for manual data entry and editing */}
            <div className="h-fit">
              <DataTable
                data={data}
                addDataPoint={addDataPoint}
                removeDataPoint={removeDataPoint}
                updateDataPoint={updateDataPoint}
                loadExampleData={loadExampleData}
              />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Index;
