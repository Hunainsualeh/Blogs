import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Admin | Global Insights Daily" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-surface-muted">{children}</div>;
}
