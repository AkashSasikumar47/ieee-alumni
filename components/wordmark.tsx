export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium tracking-[-0.02em] ${className}`}
    >
      <span aria-hidden="true" className="text-[0.7em] text-primary">
        ◆
      </span>
      Alumni
    </span>
  );
}
