import { useEffect, useRef, useState } from "react";

type CopyButtonProps =
  | {
      value: string;
      variant?: "button";
      label?: never;
    }
  | {
      value: string;
      variant: "row";
      label: string;
    };

const COPY_FEEDBACK_DURATION = 1200;

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-4 transition group-hover:text-black group-data-[copied=true]:hidden"
      aria-hidden="true"
    >
      <rect width="13" height="13" x="9" y="9" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="hidden size-4 text-black group-data-[copied=true]:block"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function CopyButton({ value, variant = "button", label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      setCopied(true);
      timerRef.current = window.setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, COPY_FEEDBACK_DURATION);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  if (variant === "row") {
    return (
      <button
        type="button"
        data-copied={copied}
        className="group flex w-full cursor-pointer items-center justify-between gap-4 py-3 text-left"
        aria-label={`Copy ${value}`}
        onClick={copy}
      >
        <div className="min-w-0">
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
            {label}
          </div>

          <code className="block truncate font-mono text-sm text-gray-700 transition group-hover:text-black">
            {value}
          </code>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-gray-400">
          <span className="hidden text-xs text-gray-500 group-data-[copied=true]:block" aria-live="polite">
            Copied
          </span>

          <CopyIcon />
          <CheckIcon />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      data-copied={copied}
      className="group flex max-w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-gray-500 transition hover:border-gray-300 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      aria-label={`Copy ${value}`}
      onClick={copy}
    >
      <code className="truncate font-mono text-sm text-inherit">{value}</code>

      <span className="hidden shrink-0 text-xs group-data-[copied=true]:block" aria-live="polite">
        Copied
      </span>

      <span className="shrink-0">
        <CopyIcon />
        <CheckIcon />
      </span>
    </button>
  );
}
