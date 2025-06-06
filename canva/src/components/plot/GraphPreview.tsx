import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataPoint, PlotConfig } from '@/lib/plotDefaults';
import { toast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';

interface GraphPreviewProps {
  config: PlotConfig;
  data: DataPoint[];
}

const GraphPreview = ({ config, data }: GraphPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Function to draw placeholder graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw frame with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = gradient;
    ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Filter out data points with null values
    const validData = data.filter(point => point.x !== null && point.y !== null) as { id: string; x: number; y: number }[];
    
    if (validData.length > 0) {
      // Find data range
      const xValues = validData.map(d => d.x);
      const yValues = validData.map(d => d.y);
      const xMin = Math.min(...xValues);
      const xMax = Math.max(...xValues);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);
      
      const xRange = xMax - xMin;
      const yRange = yMax - yMin;
      
      // Draw axes
      const padding = 50;
      const chartWidth = canvas.width - padding * 2;
      const chartHeight = canvas.height - padding * 2;
      
      // Draw x and y axes
      ctx.beginPath();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.moveTo(padding, canvas.height - padding);
      ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.moveTo(padding, canvas.height - padding);
      ctx.lineTo(padding, padding);
      ctx.stroke();
      
      // Draw plot based on type
      switch(config.plotType) {
        case 'line': {
          ctx.beginPath();
          ctx.strokeStyle = config.colors[0];
          ctx.lineWidth = config.lineWidth;
          
          validData.forEach((point, i) => {
            const x = padding + ((point.x - xMin) / (xRange || 1)) * chartWidth;
            const y = canvas.height - padding - ((point.y - yMin) / (yRange || 1)) * chartHeight;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          
          ctx.stroke();
          break;
        }
        
        case 'scatter': {
          ctx.fillStyle = config.colors[0];
          
          validData.forEach(point => {
            const x = padding + ((point.x - xMin) / (xRange || 1)) * chartWidth;
            const y = canvas.height - padding - ((point.y - yMin) / (yRange || 1)) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }
        
        case 'bar': {
          const barWidth = chartWidth / validData.length * 0.8;
          const barSpacing = chartWidth / validData.length * 0.2;
          
          ctx.fillStyle = config.colors[0];
          
          validData.forEach((point, i) => {
            const x = padding + i * (barWidth + barSpacing);
            const barHeight = ((point.y - yMin) / (yRange || 1)) * chartHeight;
            const y = canvas.height - padding - barHeight;
            
            ctx.fillRect(x, y, barWidth, barHeight);
            
            if (i < 2) {
              ctx.strokeStyle = '#334155';
              ctx.lineWidth = 1;
              ctx.strokeRect(x, y, barWidth, barHeight);
            }
          });
          break;
        }
        
        case 'histogram': {
          const binCount = Math.min(8, validData.length);
          const binWidth = chartWidth / binCount;
          
          const binned = Array(binCount).fill(0);
          validData.forEach(point => {
            const binIndex = Math.min(
              binCount - 1, 
              Math.floor(((point.x - xMin) / (xRange || 1)) * binCount)
            );
            binned[binIndex]++;
          });
          
          const maxBin = Math.max(...binned);
          
          ctx.fillStyle = config.colors[0];
          binned.forEach((count, i) => {
            const x = padding + i * binWidth;
            const barHeight = (count / maxBin) * chartHeight;
            const y = canvas.height - padding - barHeight;
            
            ctx.fillRect(x, y, binWidth * 0.8, barHeight);
          });
          break;
        }
        
        case 'boxplot': {
          const sortedY = [...yValues].sort((a, b) => a - b);
          const q1 = sortedY[Math.floor(sortedY.length * 0.25)];
          const median = sortedY[Math.floor(sortedY.length * 0.5)];
          const q3 = sortedY[Math.floor(sortedY.length * 0.75)];
          const iqr = q3 - q1;
          const lowerWhisker = Math.max(yMin, q1 - 1.5 * iqr);
          const upperWhisker = Math.min(yMax, q3 + 1.5 * iqr);
          
          ctx.fillStyle = `${config.colors[0]}80`;
          const boxLeft = padding + chartWidth * 0.25;
          const boxWidth = chartWidth * 0.5;
          
          const yToCanvas = (y: number) => canvas.height - padding - ((y - yMin) / (yRange || 1)) * chartHeight;
          
          const boxTop = yToCanvas(q3);
          const boxHeight = yToCanvas(q1) - boxTop;
          
          ctx.fillRect(boxLeft, boxTop, boxWidth, boxHeight);
          
          ctx.strokeStyle = config.colors[0];
          ctx.lineWidth = 1.5;
          ctx.strokeRect(boxLeft, boxTop, boxWidth, boxHeight);
          
          ctx.beginPath();
          ctx.moveTo(boxLeft, yToCanvas(median));
          ctx.lineTo(boxLeft + boxWidth, yToCanvas(median));
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(boxLeft + boxWidth/2, boxTop);
          ctx.lineTo(boxLeft + boxWidth/2, yToCanvas(upperWhisker));
          ctx.moveTo(boxLeft + boxWidth/2, boxTop + boxHeight);
          ctx.lineTo(boxLeft + boxWidth/2, yToCanvas(lowerWhisker));
          ctx.stroke();
          
          const capWidth = boxWidth * 0.3;
          ctx.beginPath();
          ctx.moveTo(boxLeft + boxWidth/2 - capWidth/2, yToCanvas(upperWhisker));
          ctx.lineTo(boxLeft + boxWidth/2 + capWidth/2, yToCanvas(upperWhisker));
          ctx.moveTo(boxLeft + boxWidth/2 - capWidth/2, yToCanvas(lowerWhisker));
          ctx.lineTo(boxLeft + boxWidth/2 + capWidth/2, yToCanvas(lowerWhisker));
          ctx.stroke();
          break;
        }
        
        case 'pie': {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(chartWidth, chartHeight) / 2 - 20;
          
          let total = 0;
          validData.forEach(point => total += point.y);
          
          let startAngle = 0;
          validData.forEach((point, i) => {
            const sliceAngle = (point.y / total) * Math.PI * 2;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            
            const colorIndex = i % config.colors.length;
            ctx.fillStyle = config.colors[colorIndex];
            ctx.fill();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            if (sliceAngle > 0.3) {
              const labelAngle = startAngle + sliceAngle / 2;
              const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
              const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
              
              ctx.fillStyle = '#ffffff';
              ctx.font = `${config.fontSize}px ${config.fontFamily}`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(`${point.y}`, labelX, labelY);
            }
            
            startAngle += sliceAngle;
          });
          break;
        }
        
        case 'radar': {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(chartWidth, chartHeight) / 2 - 20;
          
          if (validData.length >= 3) {
            const sides = validData.length;
            
            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
              const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
              const x = centerX + Math.cos(angle) * radius;
              const y = centerY + Math.sin(angle) * radius;
              
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.closePath();
            ctx.fillStyle = '#f8fafc';
            ctx.fill();
            ctx.strokeStyle = '#e2e8f0';
            ctx.stroke();
            
            for (let i = 0; i < sides; i++) {
              const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
              const x = centerX + Math.cos(angle) * radius;
              const y = centerY + Math.sin(angle) * radius;
              
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.lineTo(x, y);
              ctx.strokeStyle = '#e2e8f0';
              ctx.stroke();
            }
            
            ctx.beginPath();
            const yMax = Math.max(...validData.map(d => d.y));
            
            for (let i = 0; i < sides; i++) {
              const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
              const value = validData[i].y / yMax;
              const x = centerX + Math.cos(angle) * radius * value;
              const y = centerY + Math.sin(angle) * radius * value;
              
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.closePath();
            ctx.fillStyle = `${config.colors[0]}80`;
            ctx.fill();
            ctx.strokeStyle = config.colors[0];
            ctx.lineWidth = 2;
            ctx.stroke();
            
            for (let i = 0; i < sides; i++) {
              const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
              const value = validData[i].y / yMax;
              const x = centerX + Math.cos(angle) * radius * value;
              const y = centerY + Math.sin(angle) * radius * value;
              
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.fill();
              ctx.strokeStyle = config.colors[0];
              ctx.stroke();
            }
          }
          break;
        }
        
        case 'area': {
          ctx.beginPath();
          ctx.strokeStyle = config.colors[0];
          ctx.lineWidth = config.lineWidth;
          
          validData.forEach((point, i) => {
            const x = padding + ((point.x - xMin) / (xRange || 1)) * chartWidth;
            const y = canvas.height - padding - ((point.y - yMin) / (yRange || 1)) * chartHeight;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          
          const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
          gradient.addColorStop(0, `${config.colors[0]}CC`);
          gradient.addColorStop(1, `${config.colors[0]}11`);
          
          const lastPoint = validData[validData.length - 1];
          const lastX = padding + ((lastPoint.x - xMin) / (xRange || 1)) * chartWidth;
          ctx.lineTo(lastX, canvas.height - padding);
          ctx.lineTo(padding, canvas.height - padding);
          
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.beginPath();
          validData.forEach((point, i) => {
            const x = padding + ((point.x - xMin) / (xRange || 1)) * chartWidth;
            const y = canvas.height - padding - ((point.y - yMin) / (yRange || 1)) * chartHeight;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.stroke();
          break;
        }
        
        case 'bubble': {
          ctx.fillStyle = `${config.colors[0]}CC`;
          
          validData.forEach(point => {
            const x = padding + ((point.x - xMin) / (xRange || 1)) * chartWidth;
            const y = canvas.height - padding - ((point.y - yMin) / (yRange || 1)) * chartHeight;
            
            const relativeSize = ((point.y - yMin) / (yRange || 1));
            const size = 5 + relativeSize * 20;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = config.colors[0];
            ctx.lineWidth = 1;
            ctx.stroke();
          });
          break;
        }
        
        // Enhanced 3D and matplotlib-style visualizations
        case 'plot3d':
        case 'scatter3d': {
          const originX = canvas.width / 2;
          const originY = canvas.height / 2 + 30;
          const scale = 120;
          
          // Draw 3D axes with matplotlib-style colors and labels
          ctx.lineWidth = 3;
          
          // X-axis (red)
          ctx.beginPath();
          ctx.strokeStyle = '#d62728';
          ctx.moveTo(originX, originY);
          ctx.lineTo(originX + scale, originY - scale * 0.2);
          ctx.stroke();
          
          // Y-axis (green) 
          ctx.beginPath();
          ctx.strokeStyle = '#2ca02c';
          ctx.moveTo(originX, originY);
          ctx.lineTo(originX - scale * 0.8, originY - scale * 0.2);
          ctx.stroke();
          
          // Z-axis (blue)
          ctx.beginPath();
          ctx.strokeStyle = '#1f77b4';
          ctx.moveTo(originX, originY);
          ctx.lineTo(originX, originY - scale);
          ctx.stroke();
          
          // Enhanced 3D spiral data visualization
          const points3d = [];
          for (let i = 0; i < 50; i++) {
            const t = i / 49 * Math.PI * 6;
            const radius = 40 * (1 - i / 49 * 0.5);
            const x3d = Math.cos(t) * radius;
            const y3d = Math.sin(t) * radius;
            const z3d = i * 3 - 75;
            
            // 3D to 2D projection (isometric)
            const x2d = originX + x3d * 0.866 - y3d * 0.5;
            const y2d = originY - z3d * 0.7 - x3d * 0.25 - y3d * 0.25;
            
            points3d.push({ x: x2d, y: y2d, z: z3d, original: { x: x3d, y: y3d, z: z3d } });
          }
          
          // Sort by depth for proper rendering
          points3d.sort((a, b) => a.z - b.z);
          
          if (config.plotType === 'plot3d') {
            // Draw connecting lines
            ctx.strokeStyle = config.colors[0];
            ctx.lineWidth = 2;
            ctx.beginPath();
            points3d.forEach((point, i) => {
              if (i === 0) {
                ctx.moveTo(point.x, point.y);
              } else {
                ctx.lineTo(point.x, point.y);
              }
            });
            ctx.stroke();
          }
          
          // Draw points with depth-based sizing
          points3d.forEach((point, i) => {
            const size = 3 + (point.z + 75) / 150 * 5;
            const alpha = 0.4 + (point.z + 75) / 150 * 0.6;
            
            ctx.fillStyle = `${config.colors[0]}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add subtle glow effect
            ctx.shadowColor = config.colors[0];
            ctx.shadowBlur = 3;
            ctx.fill();
            ctx.shadowBlur = 0;
          });
          break;
        }
        
        case 'plot_surface':
        case 'plot_wireframe': {
          const originX = canvas.width / 2;
          const originY = canvas.height / 2 + 40;
          const gridRes = 20;
          const surfaceScale = 80;
          
          // Create surface data (mathematical function)
          const surfacePoints = [];
          for (let i = 0; i < gridRes; i++) {
            for (let j = 0; j < gridRes; j++) {
              const u = (i - gridRes/2) / gridRes * 4;
              const v = (j - gridRes/2) / gridRes * 4;
              
              // More complex surface function
              const z = Math.sin(Math.sqrt(u*u + v*v)) * Math.exp(-Math.sqrt(u*u + v*v) * 0.3) * 2;
              
              const x3d = u * surfaceScale / 4;
              const y3d = v * surfaceScale / 4;
              const z3d = z * surfaceScale / 4;
              
              // Enhanced 3D projection
              const x2d = originX + x3d * 0.866 - y3d * 0.5;
              const y2d = originY - z3d * 0.8 - x3d * 0.3 - y3d * 0.3;
              
              surfacePoints.push({
                i, j, u, v, z,
                x2d, y2d, z3d,
                depth: x3d + y3d + z3d
              });
            }
          }
          
          // Sort by depth for proper rendering
          surfacePoints.sort((a, b) => a.depth - b.depth);
          
          if (config.plotType === 'plot_surface') {
            // Render surface with color mapping
            for (let i = 0; i < gridRes - 1; i++) {
              for (let j = 0; j < gridRes - 1; j++) {
                const p1 = surfacePoints[i * gridRes + j];
                const p2 = surfacePoints[i * gridRes + (j + 1)];
                const p3 = surfacePoints[(i + 1) * gridRes + j];
                const p4 = surfacePoints[(i + 1) * gridRes + (j + 1)];
                
                // Color based on height
                const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
                const colorIntensity = (avgZ + 2) / 4; // normalize to 0-1
                const hue = 240 + colorIntensity * 120; // blue to red
                
                ctx.fillStyle = `hsl(${hue}, 80%, ${50 + colorIntensity * 30}%)`;
                ctx.strokeStyle = `hsl(${hue}, 60%, 40%)`;
                ctx.lineWidth = 0.5;
                
                // Draw quadrilateral
                ctx.beginPath();
                ctx.moveTo(p1.x2d, p1.y2d);
                ctx.lineTo(p2.x2d, p2.y2d);
                ctx.lineTo(p4.x2d, p4.y2d);
                ctx.lineTo(p3.x2d, p3.y2d);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
              }
            }
          } else {
            // Wireframe rendering
            ctx.strokeStyle = config.colors[0];
            ctx.lineWidth = 1;
            
            // Draw grid lines
            for (let i = 0; i < gridRes; i++) {
              ctx.beginPath();
              for (let j = 0; j < gridRes; j++) {
                const point = surfacePoints[i * gridRes + j];
                if (j === 0) {
                  ctx.moveTo(point.x2d, point.y2d);
                } else {
                  ctx.lineTo(point.x2d, point.y2d);
                }
              }
              ctx.stroke();
            }
            
            for (let j = 0; j < gridRes; j++) {
              ctx.beginPath();
              for (let i = 0; i < gridRes; i++) {
                const point = surfacePoints[i * gridRes + j];
                if (i === 0) {
                  ctx.moveTo(point.x2d, point.y2d);
                } else {
                  ctx.lineTo(point.x2d, point.y2d);
                }
              }
              ctx.stroke();
            }
          }
          break;
        }
        
        case 'voxels': {
          const voxelSize = 8;
          const gridSize = 12;
          const startX = padding + 80;
          const startY = padding + 60;
          
          const voxels = [];
          
          // Create 3D voxel data
          for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
              for (let z = 0; z < gridSize; z++) {
                const centerX = x - gridSize/2;
                const centerY = y - gridSize/2;
                const centerZ = z - gridSize/2;
                
                // More complex 3D function
                const distance = Math.sqrt(centerX*centerX + centerY*centerY + centerZ*centerZ);
                const value = Math.max(0, 1 - distance / (gridSize/2)) * 
                             (1 + 0.3 * Math.sin(centerX) * Math.cos(centerY) * Math.sin(centerZ));
                
                if (value > 0.2) {
                  // Enhanced 3D projection with better perspective
                  const screenX = startX + x * voxelSize * 0.8 + z * voxelSize * 0.4;
                  const screenY = startY + y * voxelSize * 0.6 + z * voxelSize * 0.2;
                  const depth = x + y + z;
                  
                  voxels.push({
                    x: screenX,
                    y: screenY,
                    value,
                    depth,
                    size: voxelSize * (0.7 + value * 0.3),
                    originalCoords: { x, y, z }
                  });
                }
              }
            }
          }
          
          // Sort by depth for proper 3D rendering
          voxels.sort((a, b) => a.depth - b.depth);
          
          voxels.forEach(voxel => {
            const opacity = voxel.value * 0.9;
            const colorIndex = Math.floor(voxel.value * (config.colors.length - 1));
            const color = config.colors[colorIndex];
            
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            
            // Main face
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fillRect(voxel.x, voxel.y, voxel.size, voxel.size);
            
            // Top face (3D effect)
            ctx.fillStyle = `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)}, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(voxel.x, voxel.y);
            ctx.lineTo(voxel.x + voxel.size * 0.4, voxel.y - voxel.size * 0.3);
            ctx.lineTo(voxel.x + voxel.size * 1.4, voxel.y - voxel.size * 0.3);
            ctx.lineTo(voxel.x + voxel.size, voxel.y);
            ctx.closePath();
            ctx.fill();
            
            // Right face (3D effect)
            ctx.fillStyle = `rgba(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(voxel.x + voxel.size, voxel.y);
            ctx.lineTo(voxel.x + voxel.size * 1.4, voxel.y - voxel.size * 0.3);
            ctx.lineTo(voxel.x + voxel.size * 1.4, voxel.y + voxel.size * 0.7);
            ctx.lineTo(voxel.x + voxel.size, voxel.y + voxel.size);
            ctx.closePath();
            ctx.fill();
            
            // Edge lines for better definition
            ctx.strokeStyle = `rgba(${Math.max(0, r - 80)}, ${Math.max(0, g - 80)}, ${Math.max(0, b - 80)}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.strokeRect(voxel.x, voxel.y, voxel.size, voxel.size);
          });
          break;
        }
        
        // Gridded data types
        case 'imshow':
        case 'pcolormesh':
        case 'heatmap': {
          const cellSize = 30;
          const gridSize = Math.min(8, Math.floor(Math.sqrt(validData.length)));
          
          for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
              const dataIndex = i * gridSize + j;
              let value = 0;
              
              if (dataIndex < validData.length) {
                value = (validData[dataIndex].y - yMin) / (yRange || 1);
              }
              
              const r = Math.floor(255 * Math.min(1, value * 2));
              const b = Math.floor(255 * Math.min(1, (1 - value) * 2));
              ctx.fillStyle = `rgba(${r}, 100, ${b}, 0.8)`;
              
              const x = padding + j * cellSize + 10;
              const y = padding + i * cellSize + 10;
              ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
            }
          }
          break;
        }
        
        case 'contour':
        case 'contourf': {
          const gridSize = 40;
          const cols = Math.floor(chartWidth / gridSize);
          const rows = Math.floor(chartHeight / gridSize);
          
          const levels = 8;
          
          for (let level = 0; level < levels; level++) {
            const threshold = level / levels;
            ctx.strokeStyle = config.colors[level % config.colors.length];
            ctx.lineWidth = 1.5;
            
            for (let i = 0; i < rows - 1; i++) {
              ctx.beginPath();
              for (let j = 0; j < cols - 1; j++) {
                const x1 = padding + j * gridSize;
                const y1 = padding + i * gridSize;
                const x2 = x1 + gridSize;
                const y2 = y1 + gridSize;
                
                const value = Math.sin((x1-padding)/50) * Math.cos((y1-padding)/50) + 
                             Math.sin((x1-padding)/30) * Math.cos((y1-padding)/70);
                
                if (Math.abs(value - (threshold - 0.5)) < 0.1) {
                  if (j === 0) {
                    ctx.moveTo(x1, y1);
                  } else {
                    ctx.quadraticCurveTo(x1 - gridSize/2, y1, x1, y1);
                  }
                }
              }
              ctx.stroke();
            }
          }
          
          if (config.plotType === 'contourf') {
            for (let level = 0; level < levels; level++) {
              const alpha = 0.3;
              const color = config.colors[level % config.colors.length];
              const r = parseInt(color.slice(1, 3), 16);
              const g = parseInt(color.slice(3, 5), 16);
              const b = parseInt(color.slice(5, 7), 16);
              
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              
              for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                const centerX = padding + Math.random() * chartWidth;
                const centerY = padding + Math.random() * chartHeight;
                const radius = 20 + level * 10;
                
                for (let angle = 0; angle <= Math.PI * 2; angle += 0.3) {
                  const jitter = Math.random() * 10;
                  const x = centerX + Math.cos(angle) * (radius + jitter);
                  const y = centerY + Math.sin(angle) * (radius + jitter);
                  
                  if (angle === 0) {
                    ctx.moveTo(x, y);
                  } else {
                    ctx.lineTo(x, y);
                  }
                }
                ctx.closePath();
                ctx.fill();
              }
            }
          }
          break;
        }
        
        case 'barbs':
        case 'quiver':
        case 'streamplot': {
          const gridSize = 20;
          const rows = Math.floor(chartHeight / gridSize);
          const cols = Math.floor(chartWidth / gridSize);
          
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              const x = j / cols;
              const y = i / rows;
              
              const value = Math.sin(x * 5) * Math.cos(y * 5) * 0.5 + 0.5;
              
              const colorIndex = Math.min(Math.floor(value * config.colors.length), config.colors.length - 1);
              ctx.fillStyle = config.colors[colorIndex];
              
              const xPos = padding + j * gridSize;
              const yPos = padding + i * gridSize;
              ctx.fillRect(xPos, yPos, gridSize - 1, gridSize - 1);
            }
          }
          break;
        }
        
        // Irregular grid data types
        case 'tricontour':
        case 'tricontourf':
        case 'tripcolor': {
          const pointCount = 25;
          const points = [];
          
          for (let i = 0; i < pointCount; i++) {
            const x = padding + Math.random() * chartWidth;
            const y = padding + Math.random() * chartHeight;
            const value = Math.sin((x-padding)/40) * Math.cos((y-padding)/40);
            points.push({x, y, value});
          }
          
          for (let i = 0; i < points.length - 2; i++) {
            for (let j = i + 1; j < points.length - 1; j++) {
              for (let k = j + 1; k < points.length; k++) {
                const p1 = points[i];
                const p2 = points[j];
                const p3 = points[k];
                
                const dist1 = Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
                const dist2 = Math.sqrt((p2.x-p3.x)**2 + (p2.y-p3.y)**2);
                const dist3 = Math.sqrt((p3.x-p1.x)**2 + (p3.y-p1.y)**2);
                
                if (dist1 < 100 && dist2 < 100 && dist3 < 100) {
                  const avgValue = (p1.value + p2.value + p3.value) / 3;
                  const colorIndex = Math.floor((avgValue + 1) * config.colors.length / 2);
                  const safeColorIndex = Math.max(0, Math.min(config.colors.length - 1, colorIndex));
                  
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.lineTo(p3.x, p3.y);
                  ctx.closePath();
                  
                  if (config.plotType === 'tripcolor' || config.plotType === 'tricontourf') {
                    ctx.fillStyle = `${config.colors[safeColorIndex]}80`;
                    ctx.fill();
                  }
                  
                  if (config.plotType === 'tricontour') {
                    ctx.strokeStyle = config.colors[safeColorIndex];
                    ctx.lineWidth = 1;
                    ctx.stroke();
                  }
                }
              }
            }
          }
          break;
        }
        
        case 'triplot': {
          const pointCount = 25;
          const points = [];
          
          for (let i = 0; i < pointCount; i++) {
            const x = padding + Math.random() * chartWidth;
            const y = padding + Math.random() * chartHeight;
            points.push({x, y});
          }
          
          for (let i = 0; i < points.length - 2; i++) {
            for (let j = i + 1; j < points.length - 1; j++) {
              for (let k = j + 1; k < points.length; k++) {
                const p1 = points[i];
                const p2 = points[j];
                const p3 = points[k];
                
                const dist1 = Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
                const dist2 = Math.sqrt((p2.x-p3.x)**2 + (p2.y-p3.y)**2);
                const dist3 = Math.sqrt((p3.x-p1.x)**2 + (p3.y-p1.y)**2);
                
                if (dist1 < 100 && dist2 < 100 && dist3 < 100) {
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.lineTo(p3.x, p3.y);
                  ctx.closePath();
                  
                  ctx.strokeStyle = config.colors[0];
                  ctx.lineWidth = 1;
                  ctx.stroke();
                }
              }
            }
          }
          break;
        }
        
        case 'bar3d':
        case 'fill_between':
        case 'quiver3d':
        case 'stem3d':
        case 'plot_trisurf': {
          const originX = canvas.width / 2;
          const originY = canvas.height / 2 + 50;
          const axisLength = 100;
          
          ctx.lineWidth = 2;
          
          ctx.beginPath();
          ctx.strokeStyle = config.colors[0] || '#e74c3c';
          ctx.moveTo(originX, originY);
          ctx.lineTo(originX + axisLength, originY - axisLength / 2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.strokeStyle = config.colors[1] || '#2ecc71';
          ctx.moveTo(originX, originY);
          ctx.lineTo(originX - axisLength, originY - axisLength / 2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.strokeStyle = config.colors[2] || '#3498db';
          ctx.moveTo(originX, originY);
          ctx.lineTo(originX, originY - axisLength);
          ctx.stroke();
          
          const surfaceSize = 10;
          const surfaceHeight = 80;
          
          for (let i = 0; i < surfaceSize; i++) {
            for (let j = 0; j < surfaceSize; j++) {
              const baseX = originX + (i - surfaceSize/2) * 15;
              const baseY = originY + (j - surfaceSize/2) * 7.5;
              
              const height = Math.sin(i/2) * Math.cos(j/2) * surfaceHeight/3 + surfaceHeight/3;
              
              const x = baseX - j * 7.5;
              const y = baseY - height - i * 7.5;
              
              ctx.beginPath();
              ctx.fillStyle = config.colors[3] || '#9b59b6';
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;
        }
        
        default:
          ctx.fillStyle = '#ddd';
          ctx.fillText(`${config.plotType} visualization (preview)`, canvas.width/2 - 70, canvas.height/2);
      }
      
      ctx.fillStyle = '#334155';
      ctx.font = `${config.labelSize}px ${config.fontFamily}`;
      ctx.textAlign = 'center';
      
      ctx.fillText(config.xLabel, canvas.width / 2, canvas.height - 15);
      
      ctx.save();
      ctx.translate(15, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(config.yLabel, 0, 0);
      ctx.restore();
      
      ctx.font = `bold ${config.titleSize}px ${config.fontFamily}`;
      ctx.fillText(config.title, canvas.width / 2, 30);
    } else {
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Add data points to preview graph', canvas.width/2, canvas.height/2);
    }
    
    if (config.showGrid) {
      const gridSize = 25;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      
      for (let x = 50; x < canvas.width - 50; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 50);
        ctx.lineTo(x, canvas.height - 50);
        ctx.stroke();
      }
      
      for (let y = 50; y < canvas.height - 50; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(canvas.width - 50, y);
        ctx.stroke();
      }
    }
    
    if (config.showLegend) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(canvas.width - 120, 60, 100, 30);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(canvas.width - 120, 60, 100, 30);
      
      ctx.fillStyle = config.colors[0];
      ctx.fillRect(canvas.width - 110, 70, 15, 10);
      
      ctx.fillStyle = '#334155';
      ctx.font = `${config.fontSize}px ${config.fontFamily}`;
      ctx.textAlign = 'left';
      ctx.fillText('Dataset', canvas.width - 90, 80);
    }
    
  }, [config, data]);
  
  const handleGenerateGraph = () => {
    const validData = data.filter(point => point.x !== null && point.y !== null);
    
    if (validData.length < 2) {
      toast({
        title: "Insufficient Data",
        description: "Please add at least two data points with valid values.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Graph Generated",
      description: "Your scientific plot has been created successfully.",
      variant: "default",
    });
  };
  
  return (
    <Card className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white shadow-lg">
      <CardContent className="pt-4 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="bg-white border rounded-lg flex-1 flex items-center justify-center mb-3 overflow-hidden shadow-inner transition-all hover:shadow-md">
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={400} 
              className="max-w-full max-h-full"
            />
          </div>
          
          <Button 
            size="sm"
            className="w-full bg-science-800 hover:bg-science-700 transition-colors shadow-md transform hover:translate-y-[-1px] hover:shadow-lg"
            onClick={handleGenerateGraph}
          >
            <Download className="mr-2 h-3 w-3" />
            Generate Graph
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-2">
            Preview for visualization. Generate for high-resolution output.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GraphPreview;
