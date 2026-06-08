"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  Alert02Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"

import { AppIcon } from "@/components/ui/icon"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <AppIcon icon={CheckmarkCircle01Icon} />
        ),
        info: (
          <AppIcon icon={InformationCircleIcon} />
        ),
        warning: (
          <AppIcon icon={Alert02Icon} />
        ),
        error: (
          <AppIcon icon={CancelCircleIcon} />
        ),
        loading: (
          <AppIcon icon={Loading03Icon} className="animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
