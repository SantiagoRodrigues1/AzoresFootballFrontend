import { useEffect, useMemo, useState } from 'react';
import { Loader2, Link2, Upload } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createEditRequest, type PlayerProfile } from '@/services/featureService';

const FIELD_OPTIONS = [
  { value: 'name', label: 'Nome' },
  { value: 'numero', label: 'Número' },
  { value: 'position', label: 'Posição' },
  { value: 'email', label: 'Email' },
  { value: 'nickname', label: 'Alcunha' },
  { value: 'photo', label: 'Foto' }
] as const;

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

type EditableField = (typeof FIELD_OPTIONS)[number]['value'];

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem selecionada.'));
    reader.readAsDataURL(file);
  });
}

function isDataImage(value: string) {
  return /^data:image\//i.test(value);
}

function getCurrentFieldValue(player: PlayerProfile, field: EditableField) {
  switch (field) {
    case 'name':
      return player.name || '';
    case 'numero':
      return player.numero || '';
    case 'position':
      return player.position || 'Outro';
    case 'email':
      return player.email || '';
    case 'nickname':
      return player.nickname || '';
    case 'photo':
      return player.photo || '';
    default:
      return '';
  }
}

export function PlayerEditRequestDialog({
  open,
  onOpenChange,
  player,
  onSubmitted
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: PlayerProfile;
  onSubmitted?: () => void;
}) {
  const { toast } = useToast();
  const [field, setField] = useState<EditableField>('position');
  const [newValue, setNewValue] = useState('');
  const [justification, setJustification] = useState('');
  const [proofLink, setProofLink] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setField('position');
    setNewValue(player.position || 'Outro');
    setJustification('');
    setProofLink('');
    setProofImage('');
    setFieldError(null);
  }, [open, player.position]);

  const currentValue = useMemo(() => getCurrentFieldValue(player, field), [field, player]);

  useEffect(() => {
    setNewValue(getCurrentFieldValue(player, field));
    setFieldError(null);
  }, [field, player]);

  const submitMutation = useMutation({
    mutationFn: createEditRequest,
    onSuccess: () => {
      toast({
        title: 'Pedido enviado',
        description: 'A alteração foi enviada para revisão do administrador.'
      });
      onSubmitted?.();
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      toast({
        title: 'Não foi possível enviar o pedido',
        description: error instanceof Error ? error.message : 'Tenta novamente dentro de instantes.',
        variant: 'destructive'
      });
    }
  });

  const handleNewPhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      setFieldError('A nova foto tem de ser PNG, JPG ou WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFieldError('A nova foto deve ter no máximo 5MB.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setNewValue(dataUrl);
      setFieldError(null);
    } catch (error) {
      setFieldError(error instanceof Error ? error.message : 'Não foi possível carregar a nova foto.');
    }
  };

  const handleProofImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      setFieldError('A prova em imagem tem de ser PNG, JPG ou WebP.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFieldError('A imagem de prova deve ter no máximo 2MB.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setProofImage(dataUrl);
      setFieldError(null);
    } catch (error) {
      setFieldError(error instanceof Error ? error.message : 'Não foi possível carregar a imagem.');
    }
  };

  const handleSubmit = () => {
    const requestTargetId = String(player._id || player.id || '').trim();

    if (!/^[a-f\d]{24}$/i.test(requestTargetId)) {
      setFieldError('Este jogador ainda não suporta pedidos de edição nesta versão.');
      return;
    }

    if (!justification.trim() || justification.trim().length < 10) {
      setFieldError('A justificação deve ter pelo menos 10 caracteres.');
      return;
    }

    if (!String(newValue).trim()) {
      setFieldError('Indica o novo valor pretendido.');
      return;
    }

    const proof = proofImage
      ? { type: 'image' as const, value: proofImage }
      : proofLink.trim()
        ? { type: 'link' as const, value: proofLink.trim() }
        : null;

    submitMutation.mutate({
      playerId: requestTargetId,
      field,
      newValue: field === 'numero' ? Number(newValue) : newValue,
      justification: justification.trim(),
      proof
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[28px] border-border/70 p-0 sm:max-w-xl">
        <div className="bg-[linear-gradient(135deg,rgba(14,116,144,0.1),rgba(16,185,129,0.08))] px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl">Pedir edição</DialogTitle>
            <DialogDescription>
              A alteração fica pendente até revisão do administrador. Jogador: {player.name}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-field">Campo a alterar</Label>
              <Select value={field} onValueChange={(value) => setField(value as EditableField)}>
                <SelectTrigger id="edit-field" className="rounded-2xl">
                  <SelectValue placeholder="Selecionar campo" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-[24px] border border-dashed border-border/70 bg-muted/30 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Valor atual</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{String(currentValue || 'Sem valor')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-value">{field === 'photo' ? 'Nova foto (URL ou ficheiro)' : 'Novo valor'}</Label>
            {field === 'position' ? (
              <Select value={String(newValue)} onValueChange={setNewValue}>
                <SelectTrigger id="new-value" className="rounded-2xl">
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
            ) : field === 'photo' ? (
              <div className="space-y-3">
                <Input
                  id="new-value"
                  value={isDataImage(String(newValue)) ? '' : newValue}
                  type="url"
                  onChange={(event) => setNewValue(event.target.value)}
                  className="rounded-2xl"
                  placeholder="https://... ou escolhe um ficheiro abaixo"
                />
                <div className="space-y-2">
                  <Label htmlFor="new-photo-file">Nova foto (ficheiro)</Label>
                  <Input
                    id="new-photo-file"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleNewPhotoChange}
                    className="rounded-2xl"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Se escolheres um ficheiro, ele será enviado como nova foto do jogador.</p>
                {newValue ? <img src={String(newValue)} alt="Pré-visualização da nova foto" className="max-h-48 w-full rounded-[24px] object-cover" /> : null}
              </div>
            ) : (
              <Input
                id="new-value"
                value={newValue}
                type={field === 'numero' ? 'number' : field === 'email' ? 'email' : 'text'}
                onChange={(event) => setNewValue(event.target.value)}
                className="rounded-2xl"
                min={field === 'numero' ? 1 : undefined}
                max={field === 'numero' ? 99 : undefined}
                placeholder="Novo valor"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Justificação</Label>
            <Textarea
              id="justification"
              value={justification}
              onChange={(event) => setJustification(event.target.value)}
              className="min-h-28 rounded-2xl"
              placeholder="Explica porque a alteração deve ser aprovada."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="proof-link" className="inline-flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Link de prova opcional
              </Label>
              <Input
                id="proof-link"
                value={proofLink}
                onChange={(event) => setProofLink(event.target.value)}
                className="rounded-2xl"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proof-image" className="inline-flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Imagem de prova opcional
              </Label>
              <Input id="proof-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleProofImageChange} className="rounded-2xl" />
            </div>
          </div>

          {proofImage ? <img src={proofImage} alt="Pré-visualização da prova" className="max-h-48 w-full rounded-[24px] object-cover" /> : null}
          {fieldError ? <p className="text-sm font-medium text-destructive">{fieldError}</p> : null}
        </div>

        <DialogFooter className="border-t border-border/60 px-6 py-5">
          <Button type="button" variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" className="rounded-full" onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Enviar pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}