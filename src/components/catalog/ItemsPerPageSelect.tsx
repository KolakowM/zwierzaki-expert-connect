
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ItemsPerPageSelectProps {
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

export function ItemsPerPageSelect({ pageSize, onPageSizeChange }: ItemsPerPageSelectProps) {
  const pageSizeOptions = [3, 6, 9, 15, 12,18, 21, 24, 27];

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="pageSize" className="text-sm whitespace-nowrap">Wyników na stronę:</Label>
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => onPageSizeChange(parseInt(value))}
      >
        <SelectTrigger id="pageSize" className="w-20">
          <SelectValue placeholder={pageSize.toString()} />
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
