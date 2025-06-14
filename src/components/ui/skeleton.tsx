
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-cream-300/40 dark:bg-white/10",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
