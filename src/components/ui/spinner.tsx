import { cn } from "@/lib/utils"
import { Loading03Icon } from "@hugeicons/core-free-icons"

import { AppIcon } from "@/components/ui/icon"

function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<typeof AppIcon>, "icon">) {
  return (
    <AppIcon
      icon={Loading03Icon}
      role="status"
      aria-label="Loading"
      className={cn("animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
