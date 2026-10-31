import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------- Button --------------------------------- */

type ButtonVariant = "primary" | "outline" | "ghost" | "quiet";
type ButtonSize = "default" | "sm" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-[2px] font-sans text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-[#2a4a76]",
  outline: "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink/[0.04]",
  ghost: "text-ink hover:bg-ink/[0.05]",
  quiet: "bg-sand text-ink hover:bg-blush",
};

const buttonSizes: Record<ButtonSize, string> = {
  default: "h-12 px-8",
  sm: "h-9 px-4",
  lg: "h-14 px-12",
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }
>(({ className, variant = "primary", size = "default", ...props }, ref) => (
  <button ref={ref} className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)} {...props} />
));
Button.displayName = "Button";

/* ---------------------------------- Inputs --------------------------------- */

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-[2px] border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full rounded-[2px] border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full rounded-[2px] border border-input bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none",
        className,
      )}
      {...props}
    />
  ),
);
Select.displayName = "Select";

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("eyebrow mb-1.5 block text-taupe", className)} {...props}>
      {children}
    </label>
  );
}

export function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

/* --------------------------------- Accordion -------------------------------- */

export function Accordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <details key={item.title} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm text-ink transition-colors hover:text-ritual [&::-webkit-details-marker]:hidden">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em]">{item.title}</span>
            <span className="relative block h-4 w-4 text-washed">
              <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current transition-transform duration-300 group-open:scale-x-0" />
            </span>
          </summary>
          <div className="pb-5 text-sm font-light leading-relaxed text-washed">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

/* ----------------------------------- Sheet ---------------------------------- */

export function Sheet({
  open,
  onClose,
  title,
  children,
  side = "right",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: "right" | "left";
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "drawer-panel absolute top-0 flex h-full w-full max-w-md flex-col bg-background shadow-[0_0_60px_rgba(15,34,51,0.15)]",
          side === "right" ? "right-0" : "left-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <span className="font-display text-lg text-ink">{title}</span>
          <button onClick={onClose} aria-label="Close" className="text-washed transition-colors hover:text-ink">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M1 1l16 16M17 1L1 17" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

/* ----------------------------------- Modal ---------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div className="fixed inset-0 bg-ink/40" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative my-8 w-full rounded-[2px] border border-border bg-card p-6 shadow-[0_20px_60px_rgba(15,34,51,0.2)] sm:p-8",
          wide ? "max-w-3xl" : "max-w-lg",
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-washed transition-colors hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M1 1l16 16M17 1L1 17" />
          </svg>
        </button>
        {title && <h3 className="mb-4 pr-8 font-display text-xl text-ink">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

/* ----------------------------------- Badge ---------------------------------- */

export function Badge({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "rust" | "ink" }) {
  const tones = {
    gold: "border-gold bg-[#f7ecdc] text-[#6b5327]",
    rust: "border-rust/40 bg-[#f7e5dc] text-terracotta",
    ink: "border-ink/20 bg-ivory text-ink",
  } as const;
  return (
    <span className={cn("inline-block rounded-[2px] border px-2 py-0.5 font-sans text-[9px] font-medium uppercase tracking-[0.16em]", tones[tone])}>
      {children}
    </span>
  );
}
