import { Flame, Trophy, User2, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendingPanelProps {
  trending?: {
    players: Array<{ views: number; entity: any }>;
    teams: Array<{ views: number; entity: any }>;
    news: Array<{ views: number; entity: any }>;
  };
}

export function TrendingPanel({ trending }: TrendingPanelProps) {
  const sections = [
    { title: 'Jogadores em alta', icon: User2, items: trending?.players || [], keyField: 'name' },
    { title: 'Equipas em alta', icon: Trophy, items: trending?.teams || [], keyField: 'name' },
    { title: 'Notícias em alta', icon: Newspaper, items: trending?.news || [], keyField: 'title' }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {sections.map((section) => (
        <Card key={section.title} className="rounded-[28px] border-border/70 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <section.icon className="h-4 w-4 text-primary" /> {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.items.length ? section.items.map((entry) => (
              <div key={entry.entity?._id} className="flex items-center justify-between rounded-2xl bg-muted/40 px-3 py-2 text-sm">
                <span className="font-medium text-foreground">{entry.entity?.[section.keyField]}</span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Flame className="h-3.5 w-3.5 text-orange-500" /> {entry.views}</span>
              </div>
            )) : <div className="text-sm text-muted-foreground">Sem dados suficientes ainda.</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
