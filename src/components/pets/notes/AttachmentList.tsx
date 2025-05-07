
import React from "react";
import { Button } from "@/components/ui/button";
import { File, X } from "lucide-react";

interface AttachmentListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

const AttachmentList: React.FC<AttachmentListProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) return null;
  
  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
          <div className="flex items-center">
            <File className="h-4 w-4 mr-2" />
            <span className="text-sm">{file.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFile(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentList;
