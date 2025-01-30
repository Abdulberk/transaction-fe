// components/features/transactions/UploadModal.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUploadTransactionsMutation } from '@/hooks/mutations/useUploadTransactionsMutation';
import { Progress } from "@/components/ui/progress"; 

export function UploadModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const uploadMutation = useUploadTransactionsMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && !selectedFile.name.endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a CSV file",
      });
      return;
    }
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const result = await uploadMutation.mutateAsync(file);
      toast({
        title: "Upload successful",
        description: `Processed ${result.processedCount} transactions`,
      });
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Transactions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="csv" className="text-sm font-medium">
              CSV File
            </label>
            <input
              id="csv"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
            />
          </div>

          {uploadMutation.isPending && (
            <div className="space-y-2">
              <Progress value={uploadMutation.isPending ? 75 : 0} />
              <p className="text-sm text-muted-foreground">
                Processing...
              </p>
            </div>
          )}

          {uploadMutation.isSuccess && (
            <div className="text-sm text-muted-foreground">
              <p>✓ Upload complete</p>
              <p>Processed: {uploadMutation.data.processedCount} transactions</p>
              <p>Normalized: {uploadMutation.data.normalized_transactions.length} merchants</p>
              <p>Patterns detected: {uploadMutation.data.detected_patterns.length}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || uploadMutation.isPending}
            >
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}