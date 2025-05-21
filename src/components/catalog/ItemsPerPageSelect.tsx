
import React, { memo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ItemsPerPageSelectProps {
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

export const ItemsPerPageSelect = memo(function ItemsPerPageSelect({ 
  pageSize, 
  onPageSizeChange 
}: ItemsPerPageSelectProps) {
  // Uporządkowane opcje liczby wyników na stronę
  const pageSizeOptions = [3, 6, 9, 12, 15, 18, 21, 24];

  const handleValueChange = (value: string) => {
    const numValue = parseInt(value, 10);
    onPageSizeChange(numValue);
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="pageSize" className="text-sm whitespace-nowrap">Wyników na stronę:</Label>
      <Select
        value={pageSize.toString()}
        onValueChange={handleValueChange}
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
});
