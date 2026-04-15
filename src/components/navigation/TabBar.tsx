import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { isClubManagerRole } from '@/utils/access';

interface TabItem {
  path: string;
  label: string;
  icon: string;
  activeIcon: string;
  requiresRole?: string;
}

const TAB_ITEMS: TabItem[] = [
  { path: '/', label: 'Home', icon: '🏠', activeIcon: '🏡' },
  { path: '/my-matches', label: 'Os Meus Jogos', icon: '👥', activeIcon: '👥', requiresRole: 'team_manager' },
  { path: '/matches', label: 'Jogos', icon: '⚽', activeIcon: '⚽' },
  { path: '/community', label: 'Comunidade', icon: '💬', activeIcon: '💬' },
  { path: '/teams', label: 'Equipas', icon: '🏟️', activeIcon: '🏟️' },
  { path: '/more', label: 'Mais', icon: '☰', activeIcon: '☰' },
];

export function TabBar() {
  const location = useLocation();
  const { user } = useAuth();

  const tabs = TAB_ITEMS.filter((tab) => {
    if (tab.requiresRole) {
      return tab.requiresRole === 'team_manager'
        ? isClubManagerRole(user?.role)
        : user?.role === tab.requiresRole;
    }
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-bottom">
      <div className="flex items-center justify-around h-16 px-2 max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <motion.span
                animate={{ scale: isActive ? 1.1 : 1 }}
                className={`text-xl mb-0.5 ${isActive ? '' : 'grayscale opacity-60'}`}
              >
                {isActive ? tab.activeIcon : tab.icon}
              </motion.span>
              <span className={`text-[10px] font-medium ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
