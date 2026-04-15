import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobilePageProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  backTo?: string;
}

export function MobilePage({ title, subtitle, actions, children, className, backTo }: MobilePageProps) {
  const navigate = useNavigate();

  return (
    <div className={cn('min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.12),_transparent_32%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] pb-28', className)}>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl safe-top">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          {backTo !== undefined ? (
            <button
              onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-transform duration-200 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold tracking-tight text-foreground">{title}</h1>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {actions}
        </div>
      </header>
      <motion.main
        key={title}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        className="mx-auto max-w-4xl px-4 py-5"
      >
        {children}
      </motion.main>
    </div>
  );
}
