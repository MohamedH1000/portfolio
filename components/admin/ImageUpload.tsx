"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  folder?: string;
  onUploadComplete?: (url: string) => void;
}

export function ImageUpload({
  name,
  defaultValue = "",
  folder = "projects",
  onUploadComplete,
}: ImageUploadProps) {
  const [preview, setPreview] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Only JPG, PNG, and WebP files are allowed");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url);
        onUploadComplete?.(data.url);
      }
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-1.5">
      <input type="hidden" name={name} value={preview} />
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-32 rounded-lg border border-border/40 object-cover"
          />
          <button
            type="button"
            onClick={() => setPreview("")}
            className="absolute -top-2 -end-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
            dragOver
              ? "border-brand bg-brand/5"
              : "border-border/40 hover:border-brand/30 hover:bg-surface-high/30"
          )}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                Drop an image or click to upload
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                JPG, PNG, WebP — max 5MB
              </p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
