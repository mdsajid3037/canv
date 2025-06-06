export type PlotType = 'scatter' | 'line' | 'bar' | 'histogram' | 'boxplot' | 'heatmap' | 'pie' | 'radar' | 'area' | 'bubble' | 
  // Gridded data types
  'imshow' | 'pcolormesh' | 'contour' | 'contourf' | 'barbs' | 'quiver' | 'streamplot' |
  // Irregularly gridded data types
  'tricontour' | 'tricontourf' | 'tripcolor' | 'triplot' |
  // 3D and volumetric data types
  'bar3d' | 'fill_between' | 'plot3d' | 'quiver3d' | 'scatter3d' | 'stem3d' | 'plot_surface' | 'plot_trisurf' | 'voxels' | 'plot_wireframe';

export type DataPoint = {
  id: string;
  x: number | null;
  y: number | null;
};

export type JournalPreset = {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: number;
  titleSize: number;
  labelSize: number;
  lineWidth: number;
  colors: string[];
  backgroundColor: string;
};

export type PlotConfig = {
  title: string;
  xLabel: string;
  yLabel: string;
  plotType: PlotType;
  fontFamily: string;
  fontSize: number;
  titleSize: number;
  labelSize: number;
  lineWidth: number;
  colors: string[];
  backgroundColor: string;
  showLegend: boolean;
  showGrid: boolean;
};

export const EXAMPLE_DATA: DataPoint[] = [
  { id: '1', x: 1, y: 4 },
  { id: '2', x: 2, y: 7 },
  { id: '3', x: 3, y: 2 },
  { id: '4', x: 4, y: 9 },
  { id: '5', x: 5, y: 5 },
  { id: '6', x: 6, y: 8 },
  { id: '7', x: 7, y: 6 },
  { id: '8', x: 8, y: 3 },
];

export const PLOT_TYPES: { value: PlotType; label: string; category: string }[] = [
  // Basic plot types
  { value: 'line', label: 'Line Graph', category: 'Basic' },
  { value: 'scatter', label: 'Scatter Plot', category: 'Basic' },
  { value: 'bar', label: 'Bar Chart', category: 'Basic' },
  { value: 'histogram', label: 'Histogram', category: 'Basic' },
  { value: 'boxplot', label: 'Box Plot', category: 'Basic' },
  { value: 'heatmap', label: 'Heat Map', category: 'Basic' },
  { value: 'pie', label: 'Pie Chart', category: 'Basic' },
  { value: 'radar', label: 'Radar Plot', category: 'Basic' },
  { value: 'area', label: 'Area Chart', category: 'Basic' },
  { value: 'bubble', label: 'Bubble Chart', category: 'Basic' },
  
  // Gridded data types
  { value: 'imshow', label: 'imshow(Z)', category: 'Gridded Data' },
  { value: 'pcolormesh', label: 'pcolormesh(X, Y, Z)', category: 'Gridded Data' },
  { value: 'contour', label: 'contour(X, Y, Z)', category: 'Gridded Data' },
  { value: 'contourf', label: 'contourf(X, Y, Z)', category: 'Gridded Data' },
  { value: 'barbs', label: 'barbs(X, Y, U, V)', category: 'Gridded Data' },
  { value: 'quiver', label: 'quiver(X, Y, U, V)', category: 'Gridded Data' },
  { value: 'streamplot', label: 'streamplot(X, Y, U, V)', category: 'Gridded Data' },
  
  // Irregularly gridded data types
  { value: 'tricontour', label: 'tricontour(x, y, z)', category: 'Irregular Grid' },
  { value: 'tricontourf', label: 'tricontourf(x, y, z)', category: 'Irregular Grid' },
  { value: 'tripcolor', label: 'tripcolor(x, y, z)', category: 'Irregular Grid' },
  { value: 'triplot', label: 'triplot(x, y)', category: 'Irregular Grid' },
  
  // 3D and volumetric data types
  { value: 'bar3d', label: 'bar3d(x, y, z, dx, dy, dz)', category: '3D & Volumetric' },
  { value: 'fill_between', label: 'fill_between(x1, y1, z1, x2, y2, z2)', category: '3D & Volumetric' },
  { value: 'plot3d', label: 'plot(xs, ys, zs)', category: '3D & Volumetric' },
  { value: 'quiver3d', label: 'quiver(X, Y, Z, U, V, W)', category: '3D & Volumetric' },
  { value: 'scatter3d', label: 'scatter(xs, ys, zs)', category: '3D & Volumetric' },
  { value: 'stem3d', label: 'stem(x, y, z)', category: '3D & Volumetric' },
  { value: 'plot_surface', label: 'plot_surface(X, Y, Z)', category: '3D & Volumetric' },
  { value: 'plot_trisurf', label: 'plot_trisurf(x, y, z)', category: '3D & Volumetric' },
  { value: 'voxels', label: 'voxels([x, y, z], filled)', category: '3D & Volumetric' },
  { value: 'plot_wireframe', label: 'plot_wireframe(X, Y, Z)', category: '3D & Volumetric' },
];

export const JOURNAL_PRESETS: JournalPreset[] = [
  {
    id: 'default',
    name: 'Default',
    fontFamily: 'Arial',
    fontSize: 12,
    titleSize: 16,
    labelSize: 14,
    lineWidth: 2,
    colors: ['#4338ca', '#38b2ac', '#f56565', '#9f7aea', '#38a169'],
    backgroundColor: '#ffffff',
  },
  {
    id: 'nature',
    name: 'Nature',
    fontFamily: 'Arial',
    fontSize: 8,
    titleSize: 12,
    labelSize: 10,
    lineWidth: 1,
    colors: ['#000000', '#E64B35', '#4DBBD5', '#00A087', '#3C5488'],
    backgroundColor: '#ffffff',
  },
  {
    id: 'science',
    name: 'Science',
    fontFamily: 'Arial',
    fontSize: 9,
    titleSize: 14,
    labelSize: 12,
    lineWidth: 1.5,
    colors: ['#3B4992', '#EE0000', '#008B45', '#631879', '#008280'],
    backgroundColor: '#ffffff',
  },
  {
    id: 'ieee',
    name: 'IEEE',
    fontFamily: 'Times New Roman',
    fontSize: 8,
    titleSize: 11,
    labelSize: 9,
    lineWidth: 1,
    colors: ['#0072B2', '#E69F00', '#56B4E9', '#009E73', '#F0E442'],
    backgroundColor: '#ffffff',
  }
];

export const DEFAULT_CONFIG: PlotConfig = {
  title: 'My Scientific Plot',
  xLabel: 'X Axis',
  yLabel: 'Y Axis',
  plotType: 'line',
  fontFamily: 'Arial',
  fontSize: 12,
  titleSize: 16,
  labelSize: 14,
  lineWidth: 2,
  colors: ['#4338ca', '#38b2ac', '#f56565', '#9f7aea', '#38a169'],
  backgroundColor: '#ffffff',
  showLegend: true,
  showGrid: true,
};

// Enhanced color palettes for graph customization
export const COLOR_PALETTES = [
  {
    id: 'scientific',
    name: 'Scientific',
    colors: ['#4338ca', '#38b2ac', '#f56565', '#9f7aea', '#38a169'],
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: ['#F2FCE2', '#FEF7CD', '#FEC6A1', '#E5DEFF', '#FFDEE2'],
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    colors: ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22C55E'],
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    colors: ['#333333', '#555555', '#777777', '#999999', '#BBBBBB'],
  },
  {
    id: 'gradient',
    name: 'Gradient',
    colors: ['#1a365d', '#2a4a73', '#3c5d8f', '#7596c5', '#9fb4d9'],
  },
];

export const FONT_FAMILIES = [
  'Arial',
  'Times New Roman',
  'Helvetica',
  'Courier New',
  'Georgia',
  'Palatino',
  'Garamond',
  'Comic Sans MS',
  'Trebuchet MS',
  'Verdana',
  'Impact',
];
