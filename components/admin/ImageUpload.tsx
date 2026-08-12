"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];
const MAX_SIZE = 25 * 1024 * 1024;

function isVideo(type: string) {
  return type.startsWith("video/");
}

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
    if (file.size > MAX_SIZE) {
      alert("File must be under 25MB");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Only JPG, PNG, WebP, MP4, and WebM files are allowed");
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

  const previewIsVideo = preview && isVideo(preview);

  return (
    <div className="space-y-1.5">
      <input type="hidden" name={name} value={preview} />
      {preview ? (
        <div className="group relative inline-block">
          {previewIsVideo ? (
            <video
              src={preview}
              className="h-32 w-32 rounded-xl border border-[var(--hairline)] object-cover shadow-[var(--shadow-2)]"
              muted
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 rounded-xl border border-[var(--hairline)] object-cover shadow-[var(--shadow-2)] transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-[1.03]"
            />
          )}
          <button
            type="button"
            onClick={() => setPreview("")}
            aria-label="Remove upload"
            className="focus-ring press absolute -top-2 -end-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-destructive text-[var(--destructive-foreground)] shadow-[var(--shadow-3)] transition-transform duration-200 hover:scale-110"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "focus-ring group flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed",
            "transition-all duration-300 ease-[var(--ease-quart)]",
            dragOver
              ? "scale-[1.01] border-brand bg-brand/10 shadow-[var(--shadow-brand)]"
              : "border-border/50 hover:border-brand/40 hover:bg-surface-high/40"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-brand" />
              <p className="mt-2 text-xs text-muted-foreground">Uploading…</p>
            </>
          ) : (
            <>
              <Upload
                className={cn(
                  "mb-2 h-6 w-6 transition-all duration-300 ease-[var(--ease-spring)]",
                  dragOver
                    ? "-translate-y-1 scale-110 text-brand"
                    : "text-muted-foreground group-hover:-translate-y-0.5 group-hover:text-brand"
                )}
              />
              <p className="text-xs font-medium text-muted-foreground">
                Drop an image or video or click to upload
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                JPG, PNG, WebP, MP4, WebM — max 25MB
              </p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
