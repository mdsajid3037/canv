
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CSVUploadProps {
  onDataLoad: (csvData: string) => void;
}

const CSVUpload = ({ onDataLoad }: CSVUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      onDataLoad(csvData);
      toast({
        title: "CSV Loaded",
        description: "Your data has been successfully imported.",
      });
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      handleFileRead(csvFile);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Upload CSV Data
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
            isDragging
              ? 'border-science-500 bg-science-50'
              : 'border-gray-300 hover:border-science-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
          <p className="text-xs text-gray-600 mb-2">
            Drag CSV or click to browse
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs px-3 py-1 h-7"
          >
            Select File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 leading-tight">
          X values in first column, Y values in second column
        </p>
      </CardContent>
    </Card>
  );
};

export default CSVUpload;
