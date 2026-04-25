import { useState } from "react";
import { useUpload } from "@workspace/object-storage-web";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadButtonProps {
  onUploadSuccess: (objectPath: string) => void;
  onClear: () => void;
  currentPath: string | null;
}

export function ImageUploadButton({ onUploadSuccess, onClear, currentPath }: ImageUploadButtonProps) {
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      onUploadSuccess(response.objectPath);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  if (currentPath) {
    return (
      <div className="relative rounded-lg overflow-hidden border aspect-video max-w-sm">
        <img 
          src={`/api/storage${currentPath}`} 
          alt="Uploaded photo" 
          className="w-full h-full object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={onClear}
        >
          Remove
        </Button>
      </div>
    );
  }

  return (
    <div className="relative border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center text-muted-foreground w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
      />
      {isUploading ? (
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
      ) : (
        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
      )}
      <span className="text-sm font-medium">
        {isUploading ? "Uploading..." : "Click to upload a photo"}
      </span>
      {!isUploading && <span className="text-xs opacity-75 mt-1">Help volunteers recognize the dog</span>}
    </div>
  );
}
