import { ImageOffIcon } from 'lucide-react';

export function ProjectImagePlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 px-4 text-center text-gray-500">
      <ImageOffIcon aria-hidden="true" className="mb-2 h-6 w-6" />
      <p className="text-sm font-medium">No images yet</p>
      <p className="mt-0.5 text-xs">Screenshots coming soon.</p>
    </div>
  );
}
