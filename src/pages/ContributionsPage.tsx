import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImageUp, Loader2, Send } from 'lucide-react';
import { MobilePage } from '@/components/layout/MobilePage';
import { SearchSelect, type SearchSelectOption } from '@/components/forms/SearchSelect';
import { SubmissionStatusCard } from '@/components/submissions/SubmissionStatusCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';
import { createSubmission, getMySubmissions, getMyUploads, searchPlayers, searchTeams, uploadPlayerImage } from '@/services/featureService';

type ContributionType = 'player' | 'team' | 'match';

const positionOptions = ['Guarda-redes', 'Defesa Central', 'Lateral Esquerdo', 'Lateral Direito', 'Médio Defensivo', 'Médio', 'Médio Ofensivo', 'Extremo Esquerdo', 'Extremo Direito', 'Avançado', 'Outro'];
const islandOptions = ['Açores', 'São Miguel', 'Terceira', 'Faial', 'Pico', 'São Jorge', 'Graciosa', 'Flores', 'Corvo'];

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.response?.data?.errors?.[0] || fallback;
  }

  return fallback;
}

export function ContributionsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [type, setType] = useState<ContributionType>('player');
  const [playerTeam, setPlayerTeam] = useState<SearchSelectOption | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerPosition, setPlayerPosition] = useState('Médio');
  const [playerNickname, setPlayerNickname] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [playerNotes, setPlayerNotes] = useState('');

  const [teamName, setTeamName] = useState('');
  const [teamIsland, setTeamIsland] = useState('Açores');
  const [teamStadium, setTeamStadium] = useState('');
  const [teamFoundedYear, setTeamFoundedYear] = useState('');
  const [teamDescription, setTeamDescription] = useState('');

  const [homeTeam, setHomeTeam] = useState<SearchSelectOption | null>(null);
  const [awayTeam, setAwayTeam] = useState<SearchSelectOption | null>(null);
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [matchStadium, setMatchStadium] = useState('');
  const [matchNotes, setMatchNotes] = useState('');

  const [selectedPlayer, setSelectedPlayer] = useState<SearchSelectOption | null>(null);
  const [imageBase64, setImageBase64] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);

  const submissionsQuery = useQuery({ queryKey: queryKeys.submissions.mine, queryFn: getMySubmissions });
  const uploadsQuery = useQuery({ queryKey: queryKeys.uploads.mine, queryFn: getMyUploads });

  const submitMutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      setPlayerTeam(null);
      setPlayerName('');
      setPlayerNumber('');
      setPlayerPosition('Médio');
      setPlayerNickname('');
      setPlayerEmail('');
      setPlayerNotes('');
      setTeamName('');
      setTeamIsland('Açores');
      setTeamStadium('');
      setTeamFoundedYear('');
      setTeamDescription('');
      setHomeTeam(null);
      setAwayTeam(null);
      setMatchDate('');
      setMatchTime('');
      setMatchStadium('');
      setMatchNotes('');
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.mine });
      toast({ title: 'Contribuição enviada', description: 'A equipa administrativa vai rever o envio.' });
    },
    onError: (error) => {
      toast({
        title: 'Não foi possível submeter',
        description: getApiErrorMessage(error, 'Verifica os dados e tenta novamente.'),
        variant: 'destructive'
      });
    }
  });

  const imageMutation = useMutation({
    mutationFn: uploadPlayerImage,
    onSuccess: () => {
      setSelectedPlayer(null);
      setImageBase64('');
      setImagePreview('');
      setImageError(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads.mine });
      toast({ title: 'Imagem enviada', description: 'O upload ficou pendente para revisão.' });
    },
    onError: (error) => {
      toast({
        title: 'Upload falhou',
        description: getApiErrorMessage(error, 'A imagem não pôde ser enviada.'),
        variant: 'destructive'
      });
    }
  });

  const formPayload = useMemo(() => {
    if (type === 'player') {
      return {
        name: playerName.trim(),
        numero: Number(playerNumber),
        position: playerPosition,
        teamId: playerTeam?.id,
        email: playerEmail.trim() || undefined,
        nickname: playerNickname.trim() || undefined,
        notes: playerNotes.trim() || undefined
      };
    }

    if (type === 'team') {
      return {
        name: teamName.trim(),
        island: teamIsland,
        stadium: teamStadium.trim() || undefined,
        foundedYear: teamFoundedYear ? Number(teamFoundedYear) : undefined,
        description: teamDescription.trim() || undefined
      };
    }

    return {
      homeTeamId: homeTeam?.id,
      awayTeamId: awayTeam?.id,
      date: matchDate ? new Date(`${matchDate}T${matchTime || '12:00'}:00`).toISOString() : undefined,
      time: matchTime,
      stadium: matchStadium.trim() || undefined,
      notes: matchNotes.trim() || undefined
    };
  }, [
    awayTeam,
    homeTeam,
    matchDate,
    matchNotes,
    matchStadium,
    matchTime,
    playerEmail,
    playerName,
    playerNickname,
    playerNotes,
    playerNumber,
    playerPosition,
    playerTeam,
    teamDescription,
    teamFoundedYear,
    teamIsland,
    teamName,
    teamStadium,
    type
  ]);

  const validationErrors = useMemo(() => {
    if (type === 'player') {
      const errors: string[] = [];
      if (!playerName.trim()) errors.push('Indica o nome do jogador.');
      if (!playerTeam) errors.push('Seleciona a equipa do jogador.');
      if (!playerNumber || Number.isNaN(Number(playerNumber)) || Number(playerNumber) < 1 || Number(playerNumber) > 99) {
        errors.push('O número deve estar entre 1 e 99.');
      }
      return errors;
    }

    if (type === 'team') {
      const errors: string[] = [];
      if (!teamName.trim()) errors.push('Indica o nome da equipa.');
      if (!teamDescription.trim()) errors.push('Adiciona uma descrição para contextualizar a submissão.');
      return errors;
    }

    const errors: string[] = [];
    if (!homeTeam) errors.push('Seleciona a equipa da casa.');
    if (!awayTeam) errors.push('Seleciona a equipa visitante.');
    if (homeTeam && awayTeam && homeTeam.id === awayTeam.id) errors.push('As equipas do jogo têm de ser diferentes.');
    if (!matchDate) errors.push('Escolhe a data do jogo.');
    if (!matchTime) errors.push('Escolhe a hora do jogo.');
    return errors;
  }, [awayTeam, homeTeam, matchDate, matchTime, playerName, playerNumber, playerTeam, teamDescription, teamName, type]);

  const isSubmissionDisabled = validationErrors.length > 0 || submitMutation.isPending;

  const playerSearch = async (query: string) => {
    const results = await searchPlayers(query);
    return results.map((item) => ({
      id: item._id,
      title: item.name || item.nome || 'Jogador',
      subtitle: [item.teamName || item.team, item.position].filter(Boolean).join(' · ')
    }));
  };

  const teamSearch = async (query: string) => {
    const results = await searchTeams(query);
    return results.map((item) => ({
      id: item._id,
      title: item.name || item.equipa || 'Equipa',
      subtitle: item.island || 'Açores'
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError('Formato inválido. Usa PNG, JPG ou WEBP.');
      setImageBase64('');
      setImagePreview('');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('A imagem excede o limite de 5MB.');
      setImageBase64('');
      setImagePreview('');
      return;
    }

    setImageError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      setImageBase64(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <MobilePage title="Contribuições" subtitle="Envio com aprovação administrativa" backTo="/more">
      <div className="space-y-5">
        <Card className="rounded-[28px] border-border/70">
          <CardContent className="space-y-4 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={type} onValueChange={(value: ContributionType) => setType(value)}>
                  <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player">Jogador</SelectItem>
                    <SelectItem value="team">Equipa</SelectItem>
                    <SelectItem value="match">Jogo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {type === 'player' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do jogador</Label>
                  <Input value={playerName} onChange={(event) => setPlayerName(event.target.value)} className="rounded-full" placeholder="Ex: João Silva" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Equipa</Label>
                    <SearchSelect
                      value={playerTeam}
                      onChange={setPlayerTeam}
                      onSearch={teamSearch}
                      queryKey="player-team"
                      placeholder="Pesquisar equipa"
                      searchPlaceholder="Pesquisar equipa..."
                      emptyText="Sem equipas encontradas."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Número</Label>
                    <Input value={playerNumber} onChange={(event) => setPlayerNumber(event.target.value)} className="rounded-full" inputMode="numeric" placeholder="Ex: 10" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Posição</Label>
                    <Select value={playerPosition} onValueChange={setPlayerPosition}>
                      <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {positionOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Alcunha</Label>
                    <Input value={playerNickname} onChange={(event) => setPlayerNickname(event.target.value)} className="rounded-full" placeholder="Opcional" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={playerEmail} onChange={(event) => setPlayerEmail(event.target.value)} className="rounded-full" placeholder="Opcional" type="email" />
                </div>
                <div className="space-y-2">
                  <Label>Notas</Label>
                  <Textarea
                    value={playerNotes}
                    onChange={(event) => setPlayerNotes(event.target.value)}
                    className="min-h-28 rounded-3xl"
                    placeholder="Contexto útil: percurso, fonte, estatísticas ou observações."
                  />
                </div>
              </div>
            ) : null}

            {type === 'team' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da equipa</Label>
                  <Input value={teamName} onChange={(event) => setTeamName(event.target.value)} className="rounded-full" placeholder="Ex: União Micaelense" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Ilha</Label>
                    <Select value={teamIsland} onValueChange={setTeamIsland}>
                      <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {islandOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ano de fundação</Label>
                    <Input value={teamFoundedYear} onChange={(event) => setTeamFoundedYear(event.target.value)} className="rounded-full" inputMode="numeric" placeholder="Opcional" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Estádio</Label>
                  <Input value={teamStadium} onChange={(event) => setTeamStadium(event.target.value)} className="rounded-full" placeholder="Opcional" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea value={teamDescription} onChange={(event) => setTeamDescription(event.target.value)} className="min-h-28 rounded-3xl" placeholder="História, contexto competitivo e o que deve ser validado." />
                </div>
              </div>
            ) : null}

            {type === 'match' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Equipa da casa</Label>
                  <SearchSelect
                    value={homeTeam}
                    onChange={setHomeTeam}
                    onSearch={teamSearch}
                    queryKey="match-home"
                    placeholder="Pesquisar equipa da casa"
                    searchPlaceholder="Pesquisar equipa da casa..."
                    emptyText="Sem equipas encontradas."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Equipa visitante</Label>
                  <SearchSelect
                    value={awayTeam}
                    onChange={setAwayTeam}
                    onSearch={teamSearch}
                    queryKey="match-away"
                    placeholder="Pesquisar equipa visitante"
                    searchPlaceholder="Pesquisar equipa visitante..."
                    emptyText="Sem equipas encontradas."
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input value={matchDate} onChange={(event) => setMatchDate(event.target.value)} type="date" className="rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Label>Hora</Label>
                    <Input value={matchTime} onChange={(event) => setMatchTime(event.target.value)} type="time" className="rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Estádio</Label>
                  <Input value={matchStadium} onChange={(event) => setMatchStadium(event.target.value)} className="rounded-full" placeholder="Opcional" />
                </div>
                <div className="space-y-2">
                  <Label>Notas</Label>
                  <Textarea value={matchNotes} onChange={(event) => setMatchNotes(event.target.value)} className="min-h-28 rounded-3xl" placeholder="Jornada, competição, fonte ou contexto adicional." />
                </div>
              </div>
            ) : null}

            {validationErrors.length ? (
              <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-800">
                {validationErrors.map((error) => <p key={error}>{error}</p>)}
              </div>
            ) : null}

            <Button className="w-full rounded-full" onClick={() => submitMutation.mutate({ type, data: formPayload })} disabled={isSubmissionDisabled}>
              {submitMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Enviar para revisão
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-border/70">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-base font-bold"><ImageUp className="h-4 w-4 text-primary" /> Upload de imagem</div>
            <div className="space-y-2">
              <Label>Jogador</Label>
              <SearchSelect
                value={selectedPlayer}
                onChange={setSelectedPlayer}
                onSearch={playerSearch}
                queryKey="image-player"
                placeholder="Pesquisar jogador"
                searchPlaceholder="Pesquisar jogador..."
                emptyText="Sem jogadores encontrados."
              />
            </div>
            <Input type="file" accept="image/png,image/jpeg,image/webp" className="rounded-full" onChange={handleImageChange} />
            {imageError ? <p className="text-sm text-destructive">{imageError}</p> : null}
            <p className="text-xs text-muted-foreground">Se o Cloudinary não estiver configurado, o backend faz fallback local sem quebrar o envio.</p>
            {imagePreview ? <img src={imagePreview} alt="preview" className="aspect-video w-full rounded-3xl object-cover" /> : null}
            <Button
              className="w-full rounded-full"
              variant="secondary"
              onClick={() => selectedPlayer && imageMutation.mutate({ playerId: selectedPlayer.id, imageBase64 })}
              disabled={!selectedPlayer || !imageBase64.startsWith('data:image/') || imageMutation.isPending}
            >
              {imageMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageUp className="mr-2 h-4 w-4" />} Submeter imagem
            </Button>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Estado das submissões</h2>
            <p className="text-sm text-muted-foreground">Acompanha o que já foi aprovado, rejeitado ou continua pendente.</p>
          </div>
          {submissionsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-[28px]" />)}
            </div>
          ) : (
            (submissionsQuery.data || []).map((item) => <SubmissionStatusCard key={item._id} item={item} />)
          )}
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Meus uploads</h2>
            <p className="text-sm text-muted-foreground">As imagens aprovadas atualizam a ficha do jogador automaticamente.</p>
          </div>
          {uploadsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="h-36 rounded-[28px]" />)}
            </div>
          ) : (
            (uploadsQuery.data || []).map((item) => (
              <article key={item._id} className="rounded-[28px] border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
                <div className="flex gap-4">
                  {item.url ? <img src={item.url} alt={item.playerId?.name || 'Imagem de jogador'} className="h-20 w-20 rounded-3xl object-cover" /> : null}
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-semibold text-foreground">{item.playerId?.name || 'Jogador sem nome'}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-primary/70">{item.status}</p>
                    {item.moderationNote ? <p className="text-sm text-muted-foreground">{item.moderationNote}</p> : null}
                    <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString('pt-PT')}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </MobilePage>
  );
}