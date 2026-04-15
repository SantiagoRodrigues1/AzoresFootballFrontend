import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MobilePage } from '@/components/layout/MobilePage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAdminSubmissions, getAdminUploads, getReports, reviewImageUpload, reviewReport, reviewSubmission } from '@/services/featureService';

export function AdminReviewPage() {
  const queryClient = useQueryClient();
  const submissionsQuery = useQuery({ queryKey: ['admin-submissions'], queryFn: getAdminSubmissions });
  const uploadsQuery = useQuery({ queryKey: ['admin-uploads'], queryFn: getAdminUploads });
  const reportsQuery = useQuery({ queryKey: ['admin-reports'], queryFn: getReports });

  const submissionMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => reviewSubmission(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-submissions'] })
  });
  const uploadMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => reviewImageUpload(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-uploads'] })
  });
  const reportMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'reviewed' | 'dismissed' }) => reviewReport(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reports'] })
  });

  return (
    <MobilePage title="Painel de revisão" subtitle="Submissões, imagens e denúncias" backTo="/more">
      <Tabs defaultValue="submissions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 rounded-full">
          <TabsTrigger value="submissions" className="rounded-full">Submissões</TabsTrigger>
          <TabsTrigger value="uploads" className="rounded-full">Imagens</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-full">Denúncias</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-3">
          {(submissionsQuery.data || []).map((item) => (
            <Card key={item._id} className="rounded-[28px] border-border/70"><CardContent className="space-y-4 p-5"><div><p className="text-xs uppercase tracking-[0.2em] text-primary/70">{item.type}</p><h3 className="text-lg font-bold">{String(item.data.name || item.data.title || 'Submissão')}</h3></div><div className="flex gap-2"><Button className="rounded-full" onClick={() => submissionMutation.mutate({ id: item._id, status: 'approved' })}>Aprovar</Button><Button variant="outline" className="rounded-full" onClick={() => submissionMutation.mutate({ id: item._id, status: 'rejected' })}>Rejeitar</Button></div></CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="uploads" className="space-y-3">
          {(uploadsQuery.data || []).map((item) => (
            <Card key={item._id} className="rounded-[28px] border-border/70"><CardContent className="space-y-4 p-5">{item.url ? <img src={item.url} alt="upload" className="aspect-video w-full rounded-3xl object-cover" /> : null}<div><h3 className="text-lg font-bold">{item.playerId?.name || 'Imagem de jogador'}</h3><p className="text-sm text-muted-foreground">Estado: {item.status}</p></div><div className="flex gap-2"><Button className="rounded-full" onClick={() => uploadMutation.mutate({ id: item._id, status: 'approved' })}>Aprovar</Button><Button variant="outline" className="rounded-full" onClick={() => uploadMutation.mutate({ id: item._id, status: 'rejected' })}>Rejeitar</Button></div></CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="reports" className="space-y-3">
          {(reportsQuery.data || []).map((item: any) => (
            <Card key={item._id} className="rounded-[28px] border-border/70"><CardContent className="space-y-4 p-5"><div><p className="text-xs uppercase tracking-[0.2em] text-primary/70">{item.entityType}</p><h3 className="text-lg font-bold">{item.reason}</h3><p className="text-sm text-muted-foreground">{item.details || 'Sem detalhes adicionais.'}</p></div><div className="flex gap-2"><Button className="rounded-full" onClick={() => reportMutation.mutate({ id: item._id, status: 'reviewed' })}>Marcar revista</Button><Button variant="outline" className="rounded-full" onClick={() => reportMutation.mutate({ id: item._id, status: 'dismissed' })}>Descartar</Button></div></CardContent></Card>
          ))}
        </TabsContent>
      </Tabs>
    </MobilePage>
  );
}
