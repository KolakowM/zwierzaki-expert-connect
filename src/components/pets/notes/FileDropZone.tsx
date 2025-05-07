
import React from "react";
import { Upload } from "lucide-react";

interface FileDropZoneProps {
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onDrop, onFileSelect }) => {
  return (
    <div
      className="border-2 border-dashed rounded-lg p-4 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        multiple
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={onFileSelect}
      />
      <label htmlFor="fileInput" className="cursor-pointer">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Przeciągnij pliki lub kliknij aby wybrać
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          (max 5MB, .jpg, .pdf)
        </p>
      </label>
    </div>
  );
};

export default FileDropZone;
