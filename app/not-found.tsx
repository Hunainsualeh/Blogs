import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <div className="container-site flex flex-col items-center py-24 text-center">
          <p className="kicker text-brand">404</p>
          <h1 className="mt-3 text-[40px] font-semibold tracking-[-0.04em] text-ink sm:text-[52px]">Page not found</h1>
          <p className="mt-3 max-w-md text-ink-muted">The page you are looking for has moved or does not exist.</p>
          <div className="mt-8 flex gap-3">
            <Button href="/">Back to home</Button>
            <Button href="/search" variant="outline">Search articles</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
