export function VisitorAvatar({ size = 'small' }: { size?: 'small' | 'medium' }) {
  return <img src="/images/profile/visitor.svg" alt="" width={size === 'medium' ? 40 : 32} height={size === 'medium' ? 40 : 32} className={`shrink-0 rounded-full border border-gray-200 bg-gray-100 object-cover ${size === 'medium' ? 'h-10 w-10' : 'h-8 w-8'}`} />;
}
