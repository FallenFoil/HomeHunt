import type { Language } from "@/lib/i18n";

type Props = {
  language: Language;
  className?: string;
};

export function Flag({ language, className = "h-3 w-5" }: Props) {
  if (language === "pt") return <FlagPT className={className} />;
  return <FlagEN className={className} />;
}

function FlagEN({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 60 36"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/10`}
      aria-hidden
    >
      <rect width="60" height="36" fill="#012169" />
      <path d="M0,0 L60,36 M60,0 L0,36" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,36 M60,0 L0,36"
        stroke="#C8102E"
        strokeWidth="3.6"
        clipPath="inset(0)"
      />
      <path d="M30,0 V36 M0,18 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V36 M0,18 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function FlagPT({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/10`}
      aria-hidden
    >
      <rect width="60" height="40" fill="#DA291C" />
      <rect width="24" height="40" fill="#006A44" />
      <circle
        cx="24"
        cy="20"
        r="7"
        fill="#FFE800"
        stroke="#000"
        strokeWidth="0.8"
      />
      <circle cx="24" cy="20" r="3.8" fill="#DA291C" />
    </svg>
  );
}
