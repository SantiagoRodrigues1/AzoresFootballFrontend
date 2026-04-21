import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MobilePage } from '@/components/layout/MobilePage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getMyJournalistRequest, submitJournalistRequest } from '@/services/featureService';
import { motion } from 'framer-motion';
import { Newspaper, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export function JournalistRequestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState('');

  const requestQuery = useQuery({
    queryKey: ['journalist-request'],
    queryFn: getMyJournalistRequest
  });

  const submitMutation = useMutation({
    mutationFn: submitJournalistRequest,
    onSuccess: () => {
      toast({ title: 'Pedido enviado!', description: 'O administrador irá analisar o seu pedido.' });
      queryClient.invalidateQueries({ queryKey: ['journalist-request'] });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Não foi possível enviar o pedido.', variant: 'destructive' });
    }
  });

  const request = requestQuery.data;

  // Already a journalist
  if (user?.role === 'journalist') {
    return (
      <MobilePage title="Jornalista" subtitle="O seu perfil de jornalista">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Já é Jornalista! 🎉</h2>
          <p className="text-muted-foreground mb-6">Tem acesso para criar e gerir notícias.</p>
          <Button onClick={() => navigate('/news')} className="rounded-full">
            📰 Ir para Notícias
          </Button>
        </div>
      </MobilePage>
    );
  }

  // Has a pending request
  if (request?.status === 'pending') {
    return (
      <MobilePage title="Pedido de Jornalista" subtitle="Estado do seu pedido">
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-bold text-foreground mb-2">Pedido Pendente</h2>
          <p className="text-muted-foreground mb-2">O seu pedido está em análise pelo administrador.</p>
          <div className="bg-muted rounded-xl p-4 mt-6 mx-auto max-w-sm text-left">
            <p className="text-sm text-foreground"><strong>Nome:</strong> {request.name}</p>
            <p className="text-sm text-foreground mt-1"><strong>Empresa:</strong> {request.company}</p>
            <p className="text-xs text-muted-foreground mt-2">Enviado em {new Date(request.createdAt).toLocaleDateString('pt-PT')}</p>
          </div>
        </div>
      </MobilePage>
    );
  }

  // Request was rejected
  if (request?.status === 'rejected') {
    return (
      <MobilePage title="Pedido de Jornalista" subtitle="Estado do seu pedido">
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Pedido Rejeitado</h2>
          <p className="text-muted-foreground mb-2">Infelizmente o seu pedido não foi aprovado.</p>
          {request.rejectionReason && (
            <p className="text-sm text-red-500 mt-2">Motivo: {request.rejectionReason}</p>
          )}
          <Button onClick={() => { queryClient.removeQueries({ queryKey: ['journalist-request'] }); requestQuery.refetch(); }} variant="outline" className="rounded-full mt-6">
            Tentar Novamente
          </Button>
        </div>
      </MobilePage>
    );
  }

  // Show form
  return (
    <MobilePage
      title="Pedir Acesso de Jornalista"
      subtitle="Preencha o formulário para solicitar"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Tornar-se Jornalista</h2>
              <p className="text-sm text-muted-foreground">Crie e publique notícias sobre o futebol açoriano</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nome Completo</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="O seu nome"
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Empresa de Comunicação</label>
              <Input
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Ex: Jornal dos Açores, RTP Açores..."
                className="rounded-xl"
              />
            </div>

            <Button
              className="w-full rounded-xl"
              onClick={() => submitMutation.mutate({ name: name.trim(), company: company.trim() })}
              disabled={!name.trim() || !company.trim() || submitMutation.isPending}
            >
              {submitMutation.isPending ? 'A enviar...' : '📨 Submeter Pedido'}
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">ℹ️ Como funciona?</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>1. Preencha o formulário com os seus dados</li>
            <li>2. O administrador analisa o seu pedido</li>
            <li>3. Se aprovado, ganha acesso para criar notícias</li>
          </ul>
        </div>
      </motion.div>
    </MobilePage>
  );
}
