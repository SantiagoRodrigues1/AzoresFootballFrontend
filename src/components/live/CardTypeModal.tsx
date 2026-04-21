// components/live/CardTypeModal.tsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ShieldAlert, X } from 'lucide-react';

interface CardTypeModalProps {
  isOpen: boolean;
  onSelectCardType: (cardType: 'yellow_card' | 'red_card') => void;
  onClose: () => void;
}

const CARD_OPTIONS = [
  {
    type: 'yellow_card' as const,
    eyebrow: 'Advertencia',
    title: 'Cartao amarelo',
    description: 'Mantem o jogador em campo e regista uma sancao disciplinar leve.',
    cardBackClass: 'bg-amber-200/70',
    cardFrontClass: 'border-amber-300 bg-gradient-to-br from-amber-300 to-amber-500',
    shellClass: 'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50/60',
    pillClass: 'border-amber-200 bg-amber-100 text-amber-700',
    textClass: 'text-amber-900',
    accentClass: 'text-amber-700',
  },
  {
    type: 'red_card' as const,
    eyebrow: 'Expulsao',
    title: 'Cartao vermelho',
    description: 'Assinala uma expulsao direta com uma leitura visual mais forte e imediata.',
    cardBackClass: 'bg-destructive/20',
    cardFrontClass: 'border-destructive/30 bg-gradient-to-br from-red-500 to-red-700',
    shellClass: 'border-destructive/20 bg-gradient-to-br from-destructive/5 via-white to-destructive/10',
    pillClass: 'border-destructive/20 bg-destructive/10 text-destructive',
    textClass: 'text-destructive',
    accentClass: 'text-destructive/80',
  },
];

export const CardTypeModal: React.FC<CardTypeModalProps> = ({
  isOpen,
  onSelectCardType,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/72 backdrop-blur-md" onClick={onClose}>
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-5">
            <motion.div
              className="relative w-full max-w-2xl overflow-hidden rounded-t-[32px] border border-border/80 bg-card shadow-[0_32px_100px_-40px_rgba(2,6,23,0.88)] sm:rounded-[32px]"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

              <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-primary via-primary to-accent px-6 py-6 text-primary-foreground sm:px-7 sm:py-7">
                <div className="absolute -right-14 -top-16 h-40 w-40 rounded-full bg-white/12 blur-3xl" />
                <div className="absolute -bottom-16 left-0 h-36 w-36 rounded-full bg-secondary/25 blur-3xl" />

                <div className="relative flex items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur">
                      <ShieldAlert className="h-7 w-7" />
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/90">
                        <span className="h-2 w-2 rounded-full bg-white/80" />
                        <span>Disciplina</span>
                      </div>

                      <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-[2rem]">Selecionar cartao</h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-primary-foreground/80">
                        Escolhe a sancao disciplinar com uma layout mais forte e coerente com o identidade visual da app.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-primary-foreground transition-colors hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 bg-gradient-to-b from-background via-background to-muted/25 p-5 sm:grid-cols-2 sm:p-7">
                {CARD_OPTIONS.map((option) => (
                  <motion.button
                    key={option.type}
                    type="button"
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                    onClick={() => onSelectCardType(option.type)}
                    className={`group relative overflow-hidden rounded-[30px] border p-6 text-left shadow-[0_18px_40px_-32px_rgba(15,23,42,0.45)] transition-all ${option.shellClass}`}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/0 via-white/80 to-white/0 opacity-60" />

                    <div className="flex items-start justify-between gap-4">
                      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${option.pillClass}`}>
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>{option.eyebrow}</span>
                      </div>

                      <ChevronRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${option.accentClass}`} />
                    </div>

                    <div className="mt-8 flex items-end gap-5">
                      <div className="relative h-24 w-20 shrink-0">
                        <div className={`absolute inset-0 translate-x-3 translate-y-1 rounded-2xl ${option.cardBackClass}`} />
                        <div className={`absolute inset-0 rounded-2xl border shadow-[0_18px_35px_-22px_rgba(15,23,42,0.55)] ${option.cardFrontClass}`} />
                      </div>

                      <div className="min-w-0">
                        <h3 className={`text-xl font-black tracking-tight ${option.textClass}`}>{option.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{option.description}</p>
                      </div>
                    </div>

                    <div className={`mt-8 inline-flex items-center gap-2 text-sm font-semibold ${option.accentClass}`}>
                      <span>Selecionar</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="safe-bottom border-t border-border/80 bg-gradient-to-t from-background via-background/95 to-background/80 px-5 py-4 backdrop-blur sm:px-7">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CardTypeModal;
