import { motion } from 'framer-motion';
import { Heart, MessageCircle, Clock3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import type { NewsItem } from '@/types/features';

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]"
    >
      <Link to={`/news/${item._id}`} className="block">
        {item.image ? (
          <div className="aspect-[16/9] overflow-hidden bg-slate-200">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="bg-ocean px-5 py-10 text-white">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              {item.category}
            </span>
            <h3 className="mt-4 text-2xl font-bold leading-tight">{item.title}</h3>
          </div>
        )}
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary/80">
            <span>{item.category}</span>
            <span className="h-1 w-1 rounded-full bg-primary/40" />
            <span>{item.author?.name || 'Redação'}</span>
          </div>
          <div>
            <h3 className="line-clamp-2 text-lg font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.content}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1"><Heart className="h-4 w-4" /> {item.likesCount}</span>
              <span className="inline-flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {item.commentsCount}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs"><Clock3 className="h-3.5 w-3.5" /> {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: pt })}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
