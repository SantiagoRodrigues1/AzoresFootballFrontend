import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CalendarDays, Medal, MessageSquareText, UserRound } from 'lucide-react';
import { MobilePage } from '@/components/layout/MobilePage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { confirmPremiumCheckoutSession, createPremiumCheckoutSession, getCommunityProfile } from '@/services/featureService';
import { getPlanLabel, hasPremiumAccess } from '@/utils/access';
import { useSearchParams } from 'react-router-dom';

export function ProfilePage() {
	const { toast } = useToast();
	const [searchParams, setSearchParams] = useSearchParams();
	const { user, refreshUser } = useAuth();
	const profileQuery = useQuery({
		queryKey: ['community-profile', user?.id],
		queryFn: () => getCommunityProfile(user!.id),
		enabled: Boolean(user?.id)
	});
	const billingMutation = useMutation({
		mutationFn: createPremiumCheckoutSession,
		onSuccess: (data) => {
			if (data.url) {
				window.location.assign(data.url);
			}
		},
		onError: () => {
			toast({
				title: 'Checkout indisponível',
				description: 'Não foi possível iniciar a subscrição premium neste momento.',
				variant: 'destructive'
			});
		}
	});

	const profile = profileQuery.data;
	const billingStatus = searchParams.get('billing');
	const checkoutSessionId = searchParams.get('session_id');
	const upgradeIntent = searchParams.get('upgrade');

	useEffect(() => {
		if (!billingStatus) {
			return;
		}

		let cancelled = false;

		const finalizeCheckout = async () => {
			try {
				if (billingStatus === 'success' && checkoutSessionId) {
					await confirmPremiumCheckoutSession(checkoutSessionId);
				}

				await refreshUser();

				if (!cancelled) {
					toast({
						title: billingStatus === 'success' ? 'Premium ativo' : 'Checkout cancelado',
						description: billingStatus === 'success'
							? 'A tua conta foi atualizada com o plano premium.'
							: 'A subscrição não foi concluída.'
					});
				}
			} catch (error) {
				if (!cancelled) {
					toast({
						title: 'Estado do pagamento por confirmar',
						description: error instanceof Error ? error.message : 'Não foi possível validar a subscrição premium.',
						variant: 'destructive'
					});
				}
			} finally {
				if (!cancelled) {
					setSearchParams((current) => {
						const next = new URLSearchParams(current);
						next.delete('billing');
						next.delete('session_id');
						return next;
					});
				}
			}
		};

		void finalizeCheckout();

		return () => {
			cancelled = true;
		};
	}, [billingStatus, checkoutSessionId, refreshUser, setSearchParams, toast]);

	return (
		<MobilePage title="Perfil" subtitle="Comunidade e conquistas" backTo="/more">
			<Card className="rounded-[28px] border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
				<CardContent className="p-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Plano</p>
							<h2 className="mt-2 text-2xl font-bold text-foreground">{getPlanLabel(user)}</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								{hasPremiumAccess(user)
									? 'Comparações avançadas e insights premium desbloqueados.'
									: upgradeIntent === 'premium'
										? 'Esta funcionalidade exige Premium ativo.'
										: 'Faz upgrade para desbloquear comparações avançadas e notificações expandidas.'}
							</p>
							{user?.subscriptionStatus ? <p className="mt-2 text-xs text-muted-foreground">Estado: {user.subscriptionStatus}</p> : null}
						</div>
						<Button
							type="button"
							className="rounded-full"
							onClick={() => billingMutation.mutate()}
							disabled={billingMutation.isPending || hasPremiumAccess(user)}
						>
							{hasPremiumAccess(user) ? 'Premium ativo' : billingMutation.isPending ? 'A redirecionar...' : 'Ativar Premium'}
						</Button>
					</div>
				</CardContent>
			</Card>
			{profile ? (
				<div className="space-y-5">
					<Card className="rounded-[28px] border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
						<CardContent className="p-6">
							<div className="flex items-center gap-4">
								<Avatar className="h-20 w-20 border border-border">
									<AvatarFallback className="text-xl font-bold">{profile.name?.charAt(0) || 'U'}</AvatarFallback>
								</Avatar>
								<div>
									<h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
									<p className="text-sm text-muted-foreground">@{profile.username || profile.name.toLowerCase().replace(/\s+/g, '.')}</p>
									<p className="mt-1 text-sm text-primary/80">{profile.role || 'fan'}</p>
								</div>
							</div>

							<div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
								<div className="rounded-2xl bg-muted/40 p-4">
									<div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"><MessageSquareText className="h-4 w-4" /> Posts</div>
									<p className="mt-2 text-2xl font-bold text-foreground">{profile.postsCount}</p>
								</div>
								<div className="rounded-2xl bg-muted/40 p-4">
									<div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"><Medal className="h-4 w-4" /> Badges</div>
									<p className="mt-2 text-2xl font-bold text-foreground">{profile.achievements.length}</p>
								</div>
								<div className="rounded-2xl bg-muted/40 p-4 col-span-2 md:col-span-1">
									<div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"><CalendarDays className="h-4 w-4" /> Membro</div>
									<p className="mt-2 text-sm font-semibold text-foreground">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('pt-PT') : 'Recente'}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<section className="space-y-3">
						<h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Conquistas</h3>
						{profile.achievements.length ? profile.achievements.map((achievement) => (
							<Card key={achievement.key} className="rounded-[24px] border-border/70">
								<CardContent className="flex items-start gap-3 p-4">
									<div className="rounded-2xl bg-primary/10 p-3 text-primary"><UserRound className="h-5 w-5" /></div>
									<div>
										<p className="font-semibold text-foreground">{achievement.title}</p>
										<p className="text-sm text-muted-foreground">{achievement.description}</p>
									</div>
								</CardContent>
							</Card>
						)) : <Card className="rounded-[24px] border-border/70"><CardContent className="p-4 text-sm text-muted-foreground">Ainda sem badges desbloqueados.</CardContent></Card>}
					</section>
				</div>
			) : null}
		</MobilePage>
	);
}
