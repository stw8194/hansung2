type IconProps = { className?: string };
const base =
  "fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]";

export function HomeIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </svg>
  );
}
export function SparkIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
      <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
    </svg>
  );
}
export function VideoIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m10 9 5 3-5 3Z" />
    </svg>
  );
}
export function UserIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}
export function SkinIcon({ className = "size-8" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2.5S6 9.2 6 14a6 6 0 0 0 12 0c0-4.8-6-11.5-6-11.5Z" />
      <path d="M9.5 15.5c.8 1.4 2.3 2 3.8 1.5" />
    </svg>
  );
}
export function HairIcon({ className = "size-8" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12a7 7 0 0 1 14 0v3a7 7 0 0 1-14 0Z" />
      <path d="M5.5 11c2.8 0 5.2-1.6 6.5-4 1.1 2.2 3.5 3.8 6.5 4" />
      <path d="M9 16c1.8 1.3 4.2 1.3 6 0" />
    </svg>
  );
}
export function MakeupIcon({ className = "size-8" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m14 4 6 6-9.5 9.5a2.1 2.1 0 0 1-3 0l-3-3a2.1 2.1 0 0 1 0-3Z" />
      <path d="m12 6 6 6M4 21h7" />
    </svg>
  );
}
export function CheckIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
export function ArrowIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}
export function BackIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
export function ProductIcon({ className = "size-10" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M8 3h8M9 3v4l-2 3v10h10V10l-2-3V3" />
      <path d="M7 12h10" />
    </svg>
  );
}
export function BellIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}
