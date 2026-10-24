import Image from "next/image";
import { ImageIcon, Trash2, Video } from "lucide-react";
import { addProjectMedia, deleteProjectMedia } from "@/lib/actions";
import type { ProjectMedia } from "@/lib/types";
import { UploadField } from "./upload-field";
import { SubmitButton } from "./submit-button";
import { Card, inputClass, labelClass } from "./ui";

export function MediaManager({
  projectId,
  media,
}: {
  projectId: string;
  media: ProjectMedia[];
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-[14px] font-medium tracking-tight">Gallery</h2>
      <p className="mt-0.5 text-[11.5px] text-muted">
        Images or YouTube links. Shown on the project page.
      </p>

      {media.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {media.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-line p-2.5"
            >
              <div className="relative grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-surface-2">
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={item.caption ?? "Project media"}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <Video className="h-4 w-4 text-muted" strokeWidth={1.7} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[10.5px] text-muted">
                  {item.type}
                </p>
                <p className="truncate text-[12.5px]">
                  {item.caption ?? item.url}
                </p>
              </div>
              <form action={deleteProjectMedia}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="project_id" value={projectId} />
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-1 text-[12px] text-muted transition-colors hover:text-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 flex items-center gap-2 text-[12.5px] text-muted">
          <ImageIcon className="h-4 w-4" strokeWidth={1.7} />
          No media yet.
        </p>
      )}

      <form action={addProjectMedia} className="mt-6 space-y-4 border-t border-line pt-5">
        <input type="hidden" name="project_id" value={projectId} />

        <UploadField
          name="url"
          label="Image or video URL"
          folder={`projects/${projectId}`}
          accept="image/*,video/*"
          preview="none"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="media-type" className={labelClass}>
              Type
            </label>
            <select id="media-type" name="type" className={inputClass}>
              <option value="image">Image</option>
              <option value="video">Video / YouTube</option>
            </select>
          </div>
          <div>
            <label htmlFor="media-caption" className={labelClass}>
              Caption
            </label>
            <input
              id="media-caption"
              name="caption"
              className={inputClass}
              placeholder="Dashboard overview"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            name="sort_order"
            type="number"
            placeholder="Order"
            className={`${inputClass} max-w-28`}
          />
          <SubmitButton label="Add media" pendingLabel="Adding" />
        </div>
      </form>
    </Card>
  );
}
