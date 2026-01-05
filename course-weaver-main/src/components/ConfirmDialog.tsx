import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  requireConfirmation?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  requireConfirmation,
  onConfirm,
  isLoading,
}: ConfirmDialogProps) {
  const [confirmationInput, setConfirmationInput] = useState('');

  const handleConfirm = () => {
    if (requireConfirmation && confirmationInput !== requireConfirmation) {
      return;
    }
    onConfirm();
    setConfirmationInput('');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmationInput('');
    }
    onOpenChange(open);
  };

  const isConfirmDisabled = requireConfirmation
    ? confirmationInput !== requireConfirmation
    : false;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {requireConfirmation && (
          <div className="py-4">
            <p className="mb-2 text-sm text-muted-foreground">
              Escribe <strong>"{requireConfirmation}"</strong> para confirmar:
            </p>
            <Input
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder={requireConfirmation}
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isConfirmDisabled || isLoading}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
