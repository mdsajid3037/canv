
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import { PlotConfig } from '@/lib/plotDefaults';
import { toast } from '@/hooks/use-toast';

interface HeaderProps {
  config?: PlotConfig;
  updateConfig?: (updates: Partial<PlotConfig>) => void;
  onExport?: () => void;
}

const Header = ({ config, updateConfig, onExport }: HeaderProps) => {
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default export functionality
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = 'scientific-plot.png';
        link.href = canvas.toDataURL();
        link.click();
        
        toast({
          title: "Export Successful",
          description: "Your plot has been downloaded as an image.",
        });
      } else {
        toast({
          title: "Export Failed",
          description: "No plot available to export.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <header className="bg-gradient-to-r from-science-800 to-science-900 text-white shadow-lg py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
            SC
          </div>
          <div>
            <h1 className="text-xl font-bold">Sci Plot Canvas</h1>
            <p className="text-xs text-white/70">Scientific Plotting Tool</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-science-800 transition-all"
            onClick={handleExport}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
          
         
        </div>
      </div>
    </header>
  );
};

export default Header;
