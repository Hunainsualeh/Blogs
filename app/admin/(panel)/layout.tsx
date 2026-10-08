import { Suspense } from "react";
import { requireAdminPage } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/AdminNav";

async function Gate({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return <>{children}</>;
}

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
      <Suspense fallback={<div className="border-b border-line bg-white lg:min-h-screen lg:border-b-0 lg:border-r" />}>
        <AdminNav />
      </Suspense>
      <div className="min-w-0 px-4 py-8 sm:px-8">
        <Suspense fallback={<p className="text-sm text-ink-muted">Loading...</p>}>
          <Gate>{children}</Gate>
        </Suspense>
      </div>
    </div>
  );
}
