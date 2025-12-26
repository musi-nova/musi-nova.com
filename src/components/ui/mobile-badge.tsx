import * as React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

type Variant = "default" | "secondary" | "destructive" | "outline";

interface MobileBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactElement;
  label?: string;
  explanation?: React.ReactNode;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
  outline: "text-foreground border",
};

export default function MobileBadge({
  icon,
  label,
  explanation,
  variant = "default",
  className,
  ...props
}: MobileBadgeProps) {
  // If no icon provided, choose a generic info icon
  const Icon = icon ?? <Info size={16} />;

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {/* Desktop / md+: show full label (keeps existing visual style) */}
      {label ? (
        <div
          className={cn(
            "hidden md:inline-flex h-8 items-center text-xs font-semibold px-3 rounded-md",
            variantClasses[variant]
          )}
          aria-hidden
        >
          {label}
        </div>
      ) : null}

      {/* Mobile: show icon with label for destructive/important variants, else just icon */}
      <div className="md:hidden">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            {/* control tooltip by click: use asChild trigger and rely on Radix to open on interaction */}
            <TooltipTrigger asChild>
              <button
                type="button"
                role="button"
                tabIndex={0}
                className={cn(
                  "inline-flex h-8 items-center justify-center rounded-md px-2 gap-1.5",
                  variantClasses[variant],
                  variant !== "destructive" && "w-8 px-0"
                )}
                aria-label={typeof label === "string" ? label : "More info"}
                onKeyDown={(e) => {
                  // Ensure Enter and Space activate the tooltip trigger
                  if (e.key === 'Enter' || e.key === ' ') {
                    // Let Radix handle activation via keyboard; prevent default space scroll
                    e.preventDefault();
                    // programmatic focus/activation isn't required here because asChild passes events through
                  }
                }}
              >
                {Icon}
                {variant === "destructive" && label && (
                  <span className="text-[10px] font-bold uppercase whitespace-nowrap">{label}</span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end" className="max-w-[200px]">
              <div className="text-xs font-medium mb-1">{label}</div>
              <div className="text-[11px] leading-relaxed opacity-90">{explanation}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
