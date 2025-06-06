
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataPoint } from '@/lib/plotDefaults';
import { PlusIcon, TrashIcon } from 'lucide-react';

interface DataTableProps {
  data: DataPoint[];
  addDataPoint: () => void;
  removeDataPoint: (id: string) => void;
  updateDataPoint: (id: string, key: 'x' | 'y', value: number | null) => void;
  loadExampleData: () => void;
}

const DataTable = ({
  data,
  addDataPoint,
  removeDataPoint,
  updateDataPoint,
  loadExampleData,
}: DataTableProps) => {
  const handleChange = (id: string, key: 'x' | 'y', value: string) => {
    const numValue = value === '' ? null : Number(value);
    updateDataPoint(id, key, numValue);
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Data Points</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadExampleData}
          >
            Load Example
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Point</TableHead>
                <TableHead>X Value</TableHead>
                <TableHead>Y Value</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((point, index) => (
                <TableRow key={point.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={point.x === null ? '' : point.x}
                      onChange={(e) => handleChange(point.id, 'x', e.target.value)}
                      placeholder="X value"
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={point.y === null ? '' : point.y}
                      onChange={(e) => handleChange(point.id, 'y', e.target.value)}
                      placeholder="Y value"
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDataPoint(point.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full"
          onClick={addDataPoint}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Data Point
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataTable;
