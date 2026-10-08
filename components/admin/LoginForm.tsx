"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";
import { adminRequest } from "./api";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await adminRequest("POST", "/api/admin/login", { password });
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Sign in failed.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  if (!configured) {
    return (
      <p className="rounded-md border border-warning/40 bg-[#FDF6E9] p-4 text-[14px] leading-relaxed text-ink">
        The admin area is switched off. Set the ADMIN_PASSWORD environment variable to a password of at least 12 characters and restart the site to enable it.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Input id="admin-password" type="password" label="Password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} error={error ?? undefined} />
      <Button type="submit" disabled={busy || !password} className="w-full">
        {busy ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
