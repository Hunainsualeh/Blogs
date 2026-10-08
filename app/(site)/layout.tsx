import { Suspense } from "react";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Logo } from "@/components/ui/Logo";

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="container-site flex h-16 items-center">
        <Logo />
      </div>
    </header>
  );
}

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Suspense>
        <Footer />
      </Suspense>
      <Suspense>
        <AdSenseScript />
      </Suspense>
    </>
  );
}
