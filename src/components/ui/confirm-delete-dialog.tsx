
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  title: string;
  description: string;
  additionalWarning?: string;
  onConfirm: () => void;
  triggerButtonText?: string;
  triggerButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  triggerButtonSize?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

const ConfirmDeleteDialog = ({
  title,
  description,
  additionalWarning,
  onConfirm,
  triggerButtonText = "Usuń",
  triggerButtonVariant = "destructive",
  triggerButtonSize = "default",
  children,
}: ConfirmDeleteDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant={triggerButtonVariant} size={triggerButtonSize}>
            <Trash2 className="mr-2 h-4 w-4" />
            {triggerButtonText}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {additionalWarning && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
              <p className="font-semibold">Uwaga!</p>
              <p>{additionalWarning}</p>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;
