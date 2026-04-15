import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updatePlayer, type PlayerProfile } from '@/services/featureService';

const POSITION_OPTIONS = [
  'Guarda-redes',
  'Defesa Central',
  'Lateral Esquerdo',
  'Lateral Direito',
  'Médio Defensivo',
  'Médio',
  'Médio Ofensivo',
  'Extremo Esquerdo',
  'Extremo Direito',
  'Avançado',
  'Outro'
];

export function PlayerDirectEditDialog({
  open,
  onOpenChange,
  player,
  onUpdated
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: PlayerProfile;
  onUpdated?: () => void;
}) {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: player.name || '',
    numero: player.numero || '',
    position: player.position || 'Outro',
    email: player.email || '',
    photo: player.photo || ''
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormState({
      name: player.name || '',
      numero: player.numero || '',
      position: player.position || 'Outro',
      email: player.email || '',
      photo: player.photo || ''
    });
  }, [open, player]);

  const updateMutation = useMutation({
    mutationFn: () => updatePlayer(player._id, formState),
    onSuccess: () => {
      toast({
        title: 'Jogador atualizado',
        description: 'As alterações foram guardadas diretamente.'
      });
      onUpdated?.();
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      toast({
        title: 'Não foi possível guardar',
        description: error instanceof Error ? error.message : 'Tenta novamente.',
        variant: 'destructive'
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[28px] border-border/70 p-0 sm:max-w-xl">
        <div className="bg-[linear-gradient(135deg,rgba(14,116,144,0.12),rgba(59,130,246,0.08))] px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl">Editar jogador</DialogTitle>
            <DialogDescription>
              Como manager da equipa, podes atualizar diretamente os dados deste jogador.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="player-name">Nome</Label>
            <Input id="player-name" value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} className="rounded-2xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="player-numero">Número</Label>
            <Input id="player-numero" type="number" min={1} max={99} value={formState.numero} onChange={(event) => setFormState((current) => ({ ...current, numero: event.target.value }))} className="rounded-2xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="player-position">Posição</Label>
            <Select value={formState.position} onValueChange={(value) => setFormState((current) => ({ ...current, position: value }))}>
              <SelectTrigger id="player-position" className="rounded-2xl">
                <SelectValue placeholder="Escolher posição" />
              </SelectTrigger>
              <SelectContent>
                {POSITION_OPTIONS.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="player-email">Email</Label>
            <Input id="player-email" type="email" value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} className="rounded-2xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="player-photo">Foto</Label>
            <Input id="player-photo" type="url" value={formState.photo} onChange={(event) => setFormState((current) => ({ ...current, photo: event.target.value }))} className="rounded-2xl" placeholder="https://..." />
          </div>
        </div>

        <DialogFooter className="border-t border-border/60 px-6 py-5">
          <Button type="button" variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" className="rounded-full" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}