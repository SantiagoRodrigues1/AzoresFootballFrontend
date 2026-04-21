import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { teams } from '@/data/mockData';
import { useTheme } from 'next-themes';
import { useQuery } from '@tanstack/react-query';
import { getAchievements } from '@/services/featureService';
import { Switch } from '@/components/ui/switch';
import { getPlanLabel, hasPremiumAccess, isClubManagerRole } from '@/utils/access';
import {
  User, Star, Bell, Newspaper, MessageSquare, Search, Upload, Scale, Lock, HelpCircle,
  Building2, Trophy as TrophyIcon, Shield, FileText, PenLine, Camera, CalendarDays,
  ClipboardList, Settings, ChevronRight, Menu, Award
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function MorePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const achievementsQuery = useQuery({ queryKey: ['my-achievements'], queryFn: getAchievements });

  const menuItems: { icon: LucideIcon; label: string; action: () => void }[] = [
    { icon: User, label: 'Perfil', action: () => navigate('/profile') },
    { icon: Star, label: 'Favoritos', action: () => navigate('/favorites') },
    { icon: Bell, label: 'Notificações', action: () => navigate('/notifications') },
    { icon: Newspaper, label: 'Notícias', action: () => navigate('/news') },
    { icon: MessageSquare, label: 'Comunidade', action: () => navigate('/community') },
    { icon: Search, label: 'Pesquisa Inteligente', action: () => navigate('/search') },
    { icon: Upload, label: 'Contribuições', action: () => navigate('/contributions') },
    { icon: hasPremiumAccess(user) ? Scale : Lock, label: hasPremiumAccess(user) ? 'Comparar Jogadores' : 'Comparar Jogadores Premium', action: () => navigate(hasPremiumAccess(user) ? '/compare-players' : '/profile?upgrade=premium') },
    { icon: HelpCircle, label: 'Ajuda', action: () => {} },
  ];

  const adminItems: { icon: LucideIcon; label: string; action: () => void }[] = [
    { icon: Building2, label: 'Equipas', action: () => navigate('/teams') },
    { icon: TrophyIcon, label: 'Jogos', action: () => navigate('/matches') },
    { icon: Shield, label: 'Árbitros', action: () => navigate('/referees') },
    { icon: Settings, label: 'Admin Panel', action: () => navigate('/admin-panel') },
    { icon: Shield, label: 'Moderação', action: () => navigate('/admin/review') },
    { icon: FileText, label: 'Edit Requests', action: () => navigate('/admin/edit-requests') },
  ];

  const refereeItems: { icon: LucideIcon; label: string; action: () => void }[] = [
    { icon: ClipboardList, label: 'Meus Jogos', action: () => {} },
    { icon: FileText, label: 'Relatórios', action: () => {} },
  ];

  const clubItems: { icon: LucideIcon; label: string; action: () => void }[] = [
    { icon: TrophyIcon, label: 'Gerir Equipa', action: () => {} },
    { icon: Camera, label: 'Multimédia', action: () => {} },
    { icon: CalendarDays, label: 'Escalações', action: () => {} },
  ];

  const journalistItems: { icon: LucideIcon; label: string; action: () => void }[] = [
    { icon: PenLine, label: 'Criar Notícia', action: () => navigate('/news') },
    { icon: Newspaper, label: 'Minhas Notícias', action: () => navigate('/news') },
  ];

  const fanExtraItems: { icon: LucideIcon; label: string; action: () => void }[] = [
    { icon: FileText, label: 'Pedir Acesso Jornalista', action: () => navigate('/journalist/request') },
  ];

  const getRoleSpecificItems = () => {
    switch (user?.role) {
      case 'admin': return adminItems;
      case 'referee': return refereeItems;
      case 'journalist': return journalistItems;
      case 'club_manager':
      case 'team_manager': return clubItems;
      case 'fan': return fanExtraItems;
      default: return fanExtraItems;
    }
  };

  const roleItems = getRoleSpecificItems();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-ocean safe-top">
        <div className="px-4 py-6">
          {/* User Card */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-foreground/10 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              {user?.role === 'admin' ? <Settings className="w-7 h-7 text-primary-foreground" /> : 
               user?.role === 'referee' ? <Shield className="w-7 h-7 text-primary-foreground" /> :
               user?.role === 'journalist' ? <Newspaper className="w-7 h-7 text-primary-foreground" /> :
               isClubManagerRole(user?.role) ? <Building2 className="w-7 h-7 text-primary-foreground" /> : 
               <User className="w-7 h-7 text-primary-foreground" />}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-primary-foreground">{user?.name}</h2>
              <p className="text-sm text-primary-foreground/70">{user?.email}</p>
              <span className="inline-block mt-1 text-xs bg-primary-foreground/20 text-primary-foreground px-2 py-0.5 rounded-full">
                {user?.role === 'admin' ? 'Administrador' :
                 user?.role === 'referee' ? 'Árbitro' :
                 user?.role === 'journalist' ? 'Jornalista' :
                 isClubManagerRole(user?.role) ? 'Responsável de Clube' : 'Adepto'}
              </span>
              <p className="mt-2 text-xs text-primary-foreground/70">Plano {getPlanLabel(user)}</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="px-4 py-6 space-y-6">
        <section className="bg-card rounded-xl shadow-card border border-border overflow-hidden p-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Tema</h3>
            <p className="text-sm text-muted-foreground">Alternar entre modo claro e escuro</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{resolvedTheme || theme}</span>
            <Switch
              checked={(resolvedTheme || theme) === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2 flex items-center gap-2"><Award className="w-4 h-4" /> Conquistas</h3>
          <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden p-4 space-y-3">
            {achievementsQuery.data?.length ? achievementsQuery.data.map((achievement) => (
              <div key={achievement.key} className="rounded-xl bg-muted/40 p-3">
                <p className="font-semibold text-foreground">{achievement.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">Continua a contribuir e participar para desbloquear badges.</p>
            )}
          </div>
        </section>

        {/* Role-specific items */}
        {roleItems.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2 flex items-center gap-2">
              {user?.role === 'admin' ? <><Settings className="w-4 h-4" /> Administração</> :
               user?.role === 'referee' ? <><Shield className="w-4 h-4" /> Painel do Árbitro</> :
              <><Building2 className="w-4 h-4" /> Painel do Clube</>}
            </h3>
            <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
              {roleItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                >
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground flex-1 text-left">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Equipas Favoritas */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2 flex items-center gap-2">
            <Star className="w-4 h-4" /> Equipas Favoritas
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {teams.slice(0, 4).map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 bg-card rounded-xl p-3 shadow-card border border-border w-24 text-center"
              >
                <span className="text-2xl block mb-1">{team.logo}</span>
                <span className="text-xs font-medium text-foreground">{team.shortName}</span>
              </motion.div>
            ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0 bg-muted/50 rounded-xl p-3 border border-dashed border-border w-24 flex items-center justify-center"
            >
              <span className="text-2xl text-muted-foreground">+</span>
            </motion.button>
          </div>
        </section>

        {/* Menu Principal */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2 flex items-center gap-2">
            <Menu className="w-4 h-4" /> Menu
          </h3>
          <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            ))}
          </div>
        </section>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            logout();
            navigate('/auth');

            
          }}
          className="w-full py-4 rounded-xl bg-destructive/10 text-destructive font-semibold"
        >
          Terminar Sessão
        </motion.button>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            AzoresScore v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            AzoresScore · Futebol Açoriano
          </p>
        </div>
      </main>
    </div>
  );
}
