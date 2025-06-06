
import { useState } from 'react';
import { DEFAULT_CONFIG, PlotConfig, DataPoint, EXAMPLE_DATA, JournalPreset, PlotType } from '@/lib/plotDefaults';
import { v4 as uuidv4 } from 'uuid';

export interface UsePlotConfigReturn {
  config: PlotConfig;
  data: DataPoint[];
  updateConfig: (updates: Partial<PlotConfig>) => void;
  updateData: (newData: DataPoint[]) => void;
  addDataPoint: () => void;
  removeDataPoint: (id: string) => void;
  updateDataPoint: (id: string, key: 'x' | 'y', value: number | null) => void;
  applyJournalPreset: (preset: JournalPreset) => void;
  resetToDefault: () => void;
  loadExampleData: () => void;
  changePlotType: (type: PlotType) => void;
  loadCSVData: (csvData: string) => void;
}

export function usePlotConfig(): UsePlotConfigReturn {
  const [config, setConfig] = useState<PlotConfig>(DEFAULT_CONFIG);
  const [data, setData] = useState<DataPoint[]>([
    { id: uuidv4(), x: null, y: null },
    { id: uuidv4(), x: null, y: null },
    { id: uuidv4(), x: null, y: null },
  ]);

  const updateConfig = (updates: Partial<PlotConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateData = (newData: DataPoint[]) => {
    setData(newData);
  };

  const addDataPoint = () => {
    setData((prev) => [...prev, { id: uuidv4(), x: null, y: null }]);
  };

  const removeDataPoint = (id: string) => {
    setData((prev) => prev.filter((point) => point.id !== id));
  };

  const updateDataPoint = (id: string, key: 'x' | 'y', value: number | null) => {
    setData((prev) =>
      prev.map((point) =>
        point.id === id ? { ...point, [key]: value } : point
      )
    );
  };

  const applyJournalPreset = (preset: JournalPreset) => {
    setConfig((prev) => ({
      ...prev,
      fontFamily: preset.fontFamily,
      fontSize: preset.fontSize,
      titleSize: preset.titleSize,
      labelSize: preset.labelSize,
      lineWidth: preset.lineWidth,
      colors: [...preset.colors],
      backgroundColor: preset.backgroundColor,
    }));
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const loadExampleData = () => {
    setData([...EXAMPLE_DATA]);
  };

  const changePlotType = (type: PlotType) => {
    setConfig((prev) => ({ ...prev, plotType: type }));
  };

  const loadCSVData = (csvData: string) => {
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const xIndex = headers.findIndex(h => h.includes('x') || h.includes('time') || h.includes('date'));
      const yIndex = headers.findIndex(h => h.includes('y') || h.includes('value') || h.includes('data'));
      
      if (xIndex === -1 || yIndex === -1) {
        // If no clear headers, assume first two columns are x,y
        const parsedData = lines.slice(1).map(line => {
          const values = line.split(',');
          const x = parseFloat(values[0]?.trim());
          const y = parseFloat(values[1]?.trim());
          return {
            id: uuidv4(),
            x: isNaN(x) ? null : x,
            y: isNaN(y) ? null : y,
          };
        }).filter(point => point.x !== null && point.y !== null);
        
        setData(parsedData);
        return;
      }
      
      const parsedData = lines.slice(1).map(line => {
        const values = line.split(',');
        const x = parseFloat(values[xIndex]?.trim());
        const y = parseFloat(values[yIndex]?.trim());
        return {
          id: uuidv4(),
          x: isNaN(x) ? null : x,
          y: isNaN(y) ? null : y,
        };
      }).filter(point => point.x !== null && point.y !== null);
      
      setData(parsedData);
    } catch (error) {
      console.error('Error parsing CSV data:', error);
    }
  };

  return {
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
  };
}
