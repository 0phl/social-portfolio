import { VisitorAvatar } from './VisitorAvatar';

export function LocalComment({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <VisitorAvatar />
      <div className="min-w-0 flex-1">
        <div className="inline-block max-w-full rounded-2xl rounded-tl-sm bg-gray-50 px-4 py-2.5">
          <p className="text-xs font-semibold text-gray-900">You</p>
          <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-gray-800">{text}</p>
        </div>
      </div>
    </div>
  );
}
