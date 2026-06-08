import Link from "next/link";
import {
  Building03Icon,
  NoteIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";

import { UserMenu } from "@/components/layout/user-menu";
import { Badge } from "@/components/ui/badge";
import { AppIcon } from "@/components/ui/icon";
import type { OrganizationSummary } from "@/lib/types";

type AppShellProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  organization: OrganizationSummary;
  children: React.ReactNode;
};

export function AppShell({ user, organization, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="hidden border-r bg-sidebar/80 lg:flex lg:flex-col">
          <div className="flex h-16 items-center px-5">
            <Link href="/notes" className="group flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-foreground text-background transition-transform group-hover:-translate-y-px">
                <AppIcon icon={NoteIcon} size={20} />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-editorial text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Workspace
                </span>
                <span className="mt-1 text-sm font-medium">Notes</span>
              </span>
            </Link>
          </div>
          <div className="px-4 py-3">
            <div className="rounded-lg border bg-background/70 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AppIcon icon={Building03Icon} size={16} />
                <span className="font-editorial uppercase tracking-[0.14em]">
                  Organization
                </span>
              </div>
              <div className="mt-2 truncate text-sm font-medium">
                {organization.name}
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-1 px-3 py-3 text-sm">
            <Link
              href="/notes"
              className="group inline-flex h-9 items-center gap-2 rounded-lg px-3 text-foreground transition-colors hover:bg-background"
            >
              <AppIcon icon={NoteIcon} data-icon="inline-start" />
              Notes
            </Link>
            <Link
              href="/contact"
              className="group inline-flex h-9 items-center gap-2 rounded-lg px-3 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <AppIcon icon={Settings02Icon} data-icon="inline-start" />
              Contact
            </Link>
            <Link
              href="/settings"
              className="group inline-flex h-9 items-center gap-2 rounded-lg px-3 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <AppIcon icon={Settings02Icon} data-icon="inline-start" />
              Settings
            </Link>
          </nav>
          <div className="mt-auto border-t p-4">
            <UserMenu user={user} organizationName={organization.name} />
          </div>
        </aside>
        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/92 px-4 backdrop-blur lg:hidden">
            <Link href="/notes" className="flex items-center gap-2 font-medium">
              <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
                <AppIcon icon={NoteIcon} size={18} />
              </span>
              <span className="font-editorial text-sm">Notes</span>
            </Link>

            <Link href="/contact" className="ml-3 hidden items-center gap-2 rounded px-2 text-sm hover:bg-background lg:hidden">
              Contact
            </Link>

            <Badge
              variant="secondary"
              className="ml-auto hidden max-w-40 gap-1.5 truncate sm:inline-flex"
            >
              <AppIcon icon={Building03Icon} data-icon="inline-start" />
              <span className="truncate">{organization.name}</span>
            </Badge>
            <UserMenu user={user} organizationName={organization.name} />
          </header>
          <main className="flex min-h-0 flex-1 px-3 py-3 sm:px-5 sm:py-5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
