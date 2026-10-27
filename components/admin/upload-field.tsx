"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Video, X } from "lucide-react";
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

  return (
    <div>
      <p className={labelClass}>{label}</p>

      <input type="hidden" name={name} value={url} />

      <div className="flex flex-wrap items-center gap-2">
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
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="Paste an image URL"
        className={`${inputClass} mt-2`}
      />

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
