import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-site flex flex-col items-center py-28 text-center">
      <p className="kicker text-brand">404</p>
      <h1 className="mt-3 text-[40px] font-semibold tracking-[-0.04em] text-ink sm:text-[56px]">Page not found</h1>
      <p className="mt-3 max-w-md text-ink-muted">The page you are looking for has moved or does not exist yet.</p>
      <div className="mt-8 flex gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/search" variant="outline">Search stories</Button>
      </div>
    </div>
  );
}
