
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loader({
  size = "md",
  text,
  className,
  fullScreen = false,
}: LoaderProps) {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2
            className={cn("animate-spin text-primary", sizeClass[size], className)}
          />
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Loader2
        className={cn("animate-spin text-primary", sizeClass[size], className)}
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function ButtonLoader({ className }: { className?: string }) {
  return (
    <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
  );
}

export function TableLoader() {
  return (
    <div className="w-full py-8 flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground mt-2">Loading data...</p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="space-y-4 flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="space-y-2">
          <h3 className="font-medium text-center">Loading</h3>
          <p className="text-sm text-muted-foreground text-center">
            Please wait while we load your data...
          </p>
        </div>
      </div>
    </div>
  );
}

export function LoadingButton({ children, loading, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "flex items-center justify-center gap-2",
        loading ? "opacity-70 cursor-not-allowed" : "",
        props.className
      )}
    >
      {loading && <ButtonLoader />}
      {children}
    </button>
  );
}

export function DataLoader({ height = "300px" }: { height?: string }) {
  return (
    <div className="w-full flex items-center justify-center" style={{ height }}>
      <div className="flex flex-col items-center gap-2">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm text-muted-foreground">Loading data...</p>
      </div>
    </div>
  );
}
