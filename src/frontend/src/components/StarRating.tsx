import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function StarRating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const sizeClass =
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4";

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < value;
        const starPos = i + 1;
        return (
          <button
            key={`star-${starPos}`}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starPos)}
            className={cn(
              "transition-colors",
              interactive
                ? "cursor-pointer hover:scale-110"
                : "cursor-default pointer-events-none",
            )}
          >
            <Star
              className={cn(
                sizeClass,
                filled
                  ? "fill-primary text-primary"
                  : "fill-transparent text-muted-foreground/40",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export function RatingDisplay({
  ratings,
}: { ratings: Array<{ stars: bigint }> }) {
  if (ratings.length === 0)
    return (
      <span className="text-sm text-muted-foreground">No ratings yet</span>
    );
  const avg =
    ratings.reduce((sum, r) => sum + Number(r.stars), 0) / ratings.length;
  return (
    <div className="flex items-center gap-2">
      <StarRating value={Math.round(avg)} />
      <span className="text-sm text-muted-foreground">
        {avg.toFixed(1)} ({ratings.length}{" "}
        {ratings.length === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}
