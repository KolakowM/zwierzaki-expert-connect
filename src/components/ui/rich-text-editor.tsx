
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';

// Define types for the modules and formats
type QuillModules = {
  toolbar: (string | { [key: string]: boolean | string[] })[][];
};

type QuillFormats = string[];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Wprowadź tekst...", 
  className = "" 
}: RichTextEditorProps) {
  // Track mounted state to avoid hydration issues
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Clean up when component unmounts (optional)
    return () => {
      setIsMounted(false);
    };
  }, []);

  const modules: QuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image'],
      ['clean'],
      [{ 'table': true }],
    ],
  };

  const formats: QuillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
    'table', 'script'
  ];

  // Display a fallback during SSR or when component isn't mounted
  if (!isMounted) {
    return (
      <div className={cn("border rounded p-3 min-h-[150px]", className)}>
        {value || placeholder}
      </div>
    );
  }

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      modules={modules}
      formats={formats}
      className={cn("bg-background", className)}
    />
  );
}
