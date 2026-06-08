import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { cn } from "@/lib/utils";

type AppIconProps = Omit<
  React.ComponentProps<typeof HugeiconsIcon>,
  "icon" | "size" | "strokeWidth"
> & {
  icon: IconSvgElement;
  size?: number;
  strokeWidth?: number;
};

export function AppIcon({
  icon,
  size = 18,
  strokeWidth = 1.7,
  className,
  ...props
}: AppIconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      color="currentColor"
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}
