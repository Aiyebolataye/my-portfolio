"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Upload, Video, X } from "lucide-react";
import { MEDIA_BUCKET } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";
import { inputClass, labelClass } from "./ui";

type UploadFieldProps = {
  name: string;
  label: string;
  folder: string;
  initialUrl?: string | null;
  accept?: string;
  preview?: "image" | "video" | "none";
};

export function UploadField({
  name,
  label,
  folder,
  initialUrl = "",
  accept = "image/*",
  preview = "image",
}: UploadFieldProps) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setStatus("error");
      setError("Add Supabase keys to .env.local before uploading files.");
      return;
    }

    setStatus("uploading");
    setError(null);

    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop() ?? "bin";
      const path = `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
      setUrl(data.publicUrl);
      setStatus("idle");
    } catch (uploadError) {
      setStatus("error");
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed."
      );
    }
  }

  return (
    <div>
      <p className={labelClass}>{label}</p>

      <input type="hidden" name={name} value={url} />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={status === "uploading"}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[12.5px] font-medium transition-colors hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "uploading" ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
          ) : (
            <Upload className="h-4 w-4" strokeWidth={1.8} />
          )}
          {status === "uploading" ? "Uploading" : "Upload file"}
        </button>

        {url ? (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-line px-3 py-2.5 text-[12px] text-muted transition-colors hover:text-ink"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.8} />
            Remove
          </button>
        ) : null}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />

      <input
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="…or paste a URL"
        className={`${inputClass} mt-2`}
      />

      {error ? (
        <p className="mt-2 text-[11.5px] text-danger">{error}</p>
      ) : null}

      {url && preview === "image" ? (
        <div className="relative mt-2.5 aspect-[16/9] w-full max-w-xs overflow-hidden rounded-lg border border-line bg-surface-2">
          <Image
            src={url}
            alt="Preview"
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
      ) : null}

      {url && preview === "video" ? (
        <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[12px] text-muted">
          <Video className="h-4 w-4" strokeWidth={1.8} />
          Video attached
        </div>
      ) : null}

      {!url && preview === "image" ? (
        <div className="mt-2.5 grid aspect-[16/9] w-full max-w-xs place-items-center rounded-lg border border-dashed border-line text-muted">
          <ImagePlus className="h-5 w-5" strokeWidth={1.6} />
        </div>
      ) : null}
    </div>
  );
}
