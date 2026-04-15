import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'register';

const userRoleLabels: Record<UserRole, { label: string; description: string; icon: string }> = {
  fan: { label: 'Adepto', description: 'Seguir jogos, equipas e interagir', icon: '⚽' },
  referee: { label: 'Árbitro', description: 'Atualizar relatórios de jogo', icon: '🟨' },
  club_manager: { label: 'Responsável de Clube', description: 'Gerir equipa e escalações', icon: '🏟️' },
  admin: { label: 'Administrador', description: 'Gerir toda a aplicação', icon: '⚙️' },
};

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('fan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGDPR, setShowGDPR] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let success = false;

      if (mode === 'login') {
        success = await login(email, password);
      } else {
        success = await register(email, password, name, selectedRole);
      }

      if (success) {
        toast({
          title: mode === 'login' ? 'Bem-vindo!' : 'Conta criada!',
          description: mode === 'login'
            ? 'Autenticação bem-sucedida.'
            : 'A sua conta foi criada com sucesso.',
        });
        navigate('/');
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível completar a operação. Verifique os dados ou tente outro email.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      {/* Header */}
      <div className="bg-ocean py-8 px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-2xl font-bold text-primary-foreground mb-1">🏝️ AzoresScore</h1>
          <p className="text-primary-foreground/80 text-sm">Futebol Açoriano em Direto</p>
        </motion.div>
      </div>

      {/* Card de Autenticação */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="mx-4 -mt-8 bg-card rounded-2xl shadow-elevated border border-border overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button onClick={() => setMode('login')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${mode === 'login' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground'}`}>
            Entrar
          </button>
          <button onClick={() => setMode('register')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${mode === 'register' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground'}`}>
            Criar Conta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <label className="block text-sm font-medium text-foreground mb-2">Nome Completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="O seu nome" required className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" required className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Palavra-passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>

          {mode === 'register' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <label className="block text-sm font-medium text-foreground mb-3">Tipo de Utilizador</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(userRoleLabels) as UserRole[]).map(role => (
                  <motion.button key={role} type="button" whileTap={{ scale: 0.95 }} onClick={() => setSelectedRole(role)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${selectedRole === role ? 'border-primary bg-primary/10' : 'border-border bg-muted/50 hover:border-muted-foreground'}`}>
                    <span className="text-xl mb-1 block">{userRoleLabels[role].icon}</span>
                    <span className={`text-sm font-medium block ${selectedRole === role ? 'text-primary' : 'text-foreground'}`}>{userRoleLabels[role].label}</span>
                    <span className="text-xs text-muted-foreground">{userRoleLabels[role].description}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {mode === 'register' && (
            <div className="flex items-start gap-3">
              <input type="checkbox" id="gdpr" required className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="gdpr" className="text-xs text-muted-foreground">Li e aceito a <button type="button" onClick={() => setShowGDPR(true)} className="text-primary underline">Política de Privacidade</button> e os Termos de Utilização em conformidade com o RGPD.</label>
            </div>
          )}

          <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-glow-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {isSubmitting ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>A processar...</span> : mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </motion.button>

          {mode === 'login' && (
            <p className="text-xs text-center text-muted-foreground mt-4">💡 Dica: Use emails com "admin", "arbitro" ou "clube" para testar diferentes tipos de utilizador</p>
          )}
        </form>
      </motion.div>

      {/* Footer */}
      <div className="text-center mt-8 pb-8"><p className="text-xs text-muted-foreground">Feito com 💙 para os Açores 🏝️</p></div>

      {/* Modal RGPD */}
      <AnimatePresence>
        {showGDPR && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={() => setShowGDPR(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-card rounded-2xl max-w-md w-full max-h-[80vh] overflow-auto p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Política de Privacidade</h3>
              <div className="text-sm text-muted-foreground space-y-3">
                <p>O AzoresScore está comprometido com a proteção dos seus dados pessoais em conformidade com o Regulamento Geral de Proteção de Dados (RGPD).</p>
                <p><strong className="text-foreground">Dados recolhidos:</strong> Email, nome e preferências de equipas favoritas.</p>
                <p><strong className="text-foreground">Finalidade:</strong> Personalização da experiência e envio de notificações sobre jogos.</p>
                <p><strong className="text-foreground">Direitos:</strong> Pode aceder, retificar ou eliminar os seus dados a qualquer momento.</p>
              </div>
              <button onClick={() => setShowGDPR(false)} className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">Entendi</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
