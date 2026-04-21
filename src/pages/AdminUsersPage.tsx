import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getAdminUsers, changeUserRole, createAdminUser } from '@/services/featureService';
import { Search, UserPlus, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const ROLE_LABELS: Record<string, string> = {
  fan: 'Utilizador',
  journalist: 'Jornalista',
  referee: 'Árbitro',
  club_manager: 'Gestor de Clube',
  team_manager: 'Gestor de Equipa',
  admin: 'Administrador'
};

const ROLE_COLORS: Record<string, string> = {
  fan: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  journalist: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  referee: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  club_manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  team_manager: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  admin: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
};

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'fan' });

  const usersQuery = useQuery({
    queryKey: ['admin-users', roleFilter, search, page],
    queryFn: () => getAdminUsers({ role: roleFilter || undefined, search: search || undefined, page })
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => changeUserRole(userId, role),
    onSuccess: () => {
      toast({ title: 'Perfil atualizado!' });
      setEditingUserId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Não foi possível alterar o perfil.', variant: 'destructive' });
    }
  });

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      toast({ title: 'Utilizador criado!' });
      setShowCreate(false);
      setCreateForm({ name: '', email: '', password: '', role: 'fan' });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Não foi possível criar o utilizador.', variant: 'destructive' });
    }
  });

  const users = usersQuery.data?.data || [];
  const pagination = usersQuery.data?.pagination;

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Gestão de Utilizadores</h2>
        <Button size="sm" className="rounded-lg" onClick={() => setShowCreate(!showCreate)}>
          <UserPlus className="w-4 h-4 mr-1" /> Criar
        </Button>
      </div>

      {/* Create User Form */}
      {showCreate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card rounded-2xl border border-border p-4 shadow-sm space-y-3"
        >
          <h3 className="text-sm font-semibold text-foreground">Novo Utilizador</h3>
          <Input placeholder="Nome" value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl" />
          <Input placeholder="Email" type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} className="rounded-xl" />
          <Input placeholder="Palavra-passe" type="password" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} className="rounded-xl" />
          <select
            value={createForm.role}
            onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))}
            className="w-full px-3 py-2 bg-muted rounded-xl border border-border text-sm text-foreground"
          >
            {Object.entries(ROLE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="rounded-lg"
              onClick={() => createMutation.mutate(createForm)}
              disabled={!createForm.name || !createForm.email || !createForm.password || createMutation.isPending}
            >
              {createMutation.isPending ? 'A criar...' : 'Criar Utilizador'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowCreate(false)}>Cancelar</Button>
          </div>
        </motion.div>
      )}

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Pesquisar utilizadores..."
            className="pl-10 rounded-xl"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-muted rounded-xl border border-border text-sm text-foreground"
        >
          <option value="">Todos</option>
          {Object.entries(ROLE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {usersQuery.isLoading && (
        <div className="text-center py-8 text-muted-foreground">A carregar...</div>
      )}

      {/* Users List */}
      <div className="space-y-2">
        {users.map(u => (
          <div key={u._id} className="bg-card rounded-xl border border-border p-3 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[u.role] || ROLE_COLORS.fan}`}>
                  {ROLE_LABELS[u.role] || u.role}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
            </div>

            {editingUserId === u._id ? (
              <div className="flex items-center gap-2 ml-2">
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="px-2 py-1 bg-muted rounded-lg border border-border text-xs text-foreground"
                >
                  {Object.entries(ROLE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <Button
                  size="sm"
                  className="rounded-lg text-xs h-7"
                  onClick={() => changeRoleMutation.mutate({ userId: u._id, role: newRole })}
                  disabled={changeRoleMutation.isPending || newRole === u.role}
                >
                  Guardar
                </Button>
                <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setEditingUserId(null)}>
                  ✕
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="ml-2 h-7"
                onClick={() => { setEditingUserId(u._id); setNewRole(u.role); }}
              >
                <Shield className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            size="sm"
            variant="ghost"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {pagination.totalPages} ({pagination.total} total)
          </span>
          <Button
            size="sm"
            variant="ghost"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
