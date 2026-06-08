import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/session";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (session) {
    redirect("/notes");
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.7fr)]">
      <section className="hidden border-r bg-sidebar/80 px-10 py-10 lg:flex lg:flex-col">
        <div className="font-editorial text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground">
          Notes
        </div>
        <div className="mt-auto max-w-xl">
          <h1 className="text-5xl font-medium tracking-tight">
            A private workspace for clear notes.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
            Organize writing inside a focused account and organization shell.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        {children}
      </section>
    </main>
  );
}
