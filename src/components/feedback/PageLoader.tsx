import { LoaderCircle } from 'lucide-react';

export function PageLoader({ label = 'A carregar AzoresScore...' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-600 via-cyan-500 to-emerald-500 shadow-[0_24px_48px_-24px_rgba(14,116,144,0.55)]">
        <LoaderCircle className="h-7 w-7 animate-spin text-white" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">A preparar uma experiência mais leve e rápida.</p>
      </div>
    </div>
  );
}