import { Suspense } from "react";
import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";

async function Form() {
  if (await isAdmin()) redirect("/admin");
  return <LoginForm configured={adminConfigured()} />;
}

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <Logo />
      <h1 className="mb-6 mt-8 text-[26px] font-semibold tracking-[-0.03em] text-ink">Editor sign in</h1>
      <div className="rounded-md border border-line bg-white p-6">
        <Suspense fallback={<p className="text-sm text-ink-muted">Loading...</p>}>
          <Form />
        </Suspense>
      </div>
    </div>
  );
}
