import { motion } from 'framer-motion';
import { Bell, X, Trophy, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'lineup' | 'match' | 'info';
  title: string;
  message: string;
  matchId: string;
  teamId: string;
  teamName: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onClearAll: () => void;
}

export function NotificationCenter({
  isOpen,
  onOpenChange,
  notifications,
  onClearAll,
}: NotificationCenterProps) {
  const [displayNotifications, setDisplayNotifications] = useState(notifications);

  useEffect(() => {
    setDisplayNotifications(notifications);
  }, [notifications]);

  const unreadCount = displayNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'lineup':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'match':
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Notification Panel */}
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 400 }}
        transition={{ duration: 0.3 }}
        className={`surface-card fixed right-0 top-0 z-50 flex h-full w-96 max-w-[100vw] flex-col ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold">Notificações</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1 transition-colors hover:bg-muted"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {displayNotifications.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <p>Sem notificações</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {displayNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    notification.read
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-blue-50 border-blue-500'
                  } hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">
                        {notification.title}
                      </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                        <p className="mt-2 text-xs text-muted-foreground/80">
                        {notification.teamName} • {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {displayNotifications.length > 0 && (
          <div className="border-t border-border bg-muted/40 p-4">
            <button
              onClick={() => {
                onClearAll();
                setDisplayNotifications([]);
              }}
              className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background"
            >
              Limpar Tudo
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
