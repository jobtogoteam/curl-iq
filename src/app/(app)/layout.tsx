import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { BottomNav } from "@/components/ui/BottomNav";
import { DemoBanner } from "@/components/ui/DemoBanner";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Grain overlay */}
      <div className="grain" aria-hidden />
      {session.isDemo && <DemoBanner />}
      <main
        className={session.isDemo ? "pt-10" : ""}
        style={{ paddingBottom: "calc(6rem + env(safe-area-inset-bottom))" }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
