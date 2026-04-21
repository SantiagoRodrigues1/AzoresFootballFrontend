import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppErrorBoundary } from "@/components/feedback/AppErrorBoundary";
import { PageLoader } from "@/components/feedback/PageLoader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { RefereeRoute } from "@/guards/RefereeRoute";
import { AdminRoute } from "@/guards/AdminRoute";
import { PremiumRoute } from "@/guards/PremiumRoute";
import { TeamManagerRoute } from "@/guards/TeamManagerRoute";

function lazyNamed<TModule, TComponent extends ComponentType<any>>(
  loader: () => Promise<TModule>,
  pick: (module: TModule) => TComponent
) {
  return lazy(async () => {
    const module = await loader();
    return { default: pick(module) };
  });
}

const AuthPage = lazyNamed(() => import("@/pages/AuthPage"), (module) => module.AuthPage);
const HomePage = lazyNamed(() => import("@/pages/HomePage"), (module) => module.HomePage);
const MyMatchesPage = lazyNamed(() => import("@/pages/MyMatchesPage"), (module) => module.MyMatchesPage);
const MatchesPage = lazyNamed(() => import("@/pages/MatchesPage"), (module) => module.MatchesPage);
const MatchDetailsPage = lazy(() => import("@/pages/MatchDetailsPage"));
const MatchLineupPage = lazyNamed(() => import("@/pages/MatchLineupPage"), (module) => module.MatchLineupPage);
const TeamsPage = lazyNamed(() => import("@/pages/TeamsPage"), (module) => module.TeamsPage);
const TeamDetailPage = lazyNamed(() => import("@/pages/TeamDetailPage"), (module) => module.TeamDetailPage);
const TeamRosterPage = lazyNamed(() => import("@/pages/TeamRosterPage"), (module) => module.TeamRosterPage);
const PlayerDetailPage = lazyNamed(() => import("@/pages/PlayerDetailPage"), (module) => module.PlayerDetailPage);
const AdminPanelPage = lazyNamed(() => import("@/pages/AdminPanelPage"), (module) => module.AdminPanelPage);
const AdminAuditLogsPage = lazyNamed(() => import("@/pages/AdminAuditLogsPage"), (module) => module.AdminAuditLogsPage);
const StatsPage = lazy(() => import("@/pages/StatsPage"));
const MorePage = lazyNamed(() => import("@/pages/MorePage"), (module) => module.MorePage);
const ProfilePage = lazyNamed(() => import("@/pages/ProfilePage"), (module) => module.ProfilePage);
const RefereesPage = lazyNamed(() => import("@/pages/RefereesPage"), (module) => module.RefereesPage);
const NewsPage = lazyNamed(() => import("@/pages/NewsPage"), (module) => module.NewsPage);
const NewsDetailPage = lazyNamed(() => import("@/pages/NewsDetailPage"), (module) => module.NewsDetailPage);
const CommunityPage = lazyNamed(() => import("@/pages/CommunityPage"), (module) => module.CommunityPage);
const UserProfilePage = lazyNamed(() => import("@/pages/UserProfilePage"), (module) => module.UserProfilePage);
const FavoritesPage = lazyNamed(() => import("@/pages/FavoritesPage"), (module) => module.FavoritesPage);
const NotificationsPage = lazyNamed(() => import("@/pages/NotificationsPage"), (module) => module.NotificationsPage);
const ContributionsPage = lazyNamed(() => import("@/pages/ContributionsPage"), (module) => module.ContributionsPage);
const AdminReviewPage = lazyNamed(() => import("@/pages/AdminReviewPage"), (module) => module.AdminReviewPage);
const AdminEditRequestsPage = lazyNamed(() => import("@/pages/AdminEditRequestsPage"), (module) => module.AdminEditRequestsPage);
const SearchPage = lazyNamed(() => import("@/pages/SearchPage"), (module) => module.SearchPage);
const PlayerComparisonPage = lazyNamed(() => import("@/pages/PlayerComparisonPage"), (module) => module.PlayerComparisonPage);
const JournalistRequestPage = lazyNamed(() => import("@/pages/JournalistRequestPage"), (module) => module.JournalistRequestPage);
const NotFound = lazy(() => import("./pages/NotFound"));
const RefereeDashboard = lazy(() => import("@/pages/referee/RefereeDashboard"));
const RefereeMatches = lazy(() => import("@/pages/referee/RefereeMatches"));
const MatchDetails = lazy(() => import("@/pages/referee/MatchDetails"));
const UploadReport = lazy(() => import("@/pages/referee/UploadReport"));
const AdminMatches = lazy(() => import("@/pages/admin/AdminMatches"));
const AssignReferees = lazy(() => import("@/pages/admin/AssignReferees"));
const LiveMatchManager = lazy(() => import("@/pages/LiveMatchManager"));
const RefereePendingApproval = lazy(() => import("@/components/referee/RefereePendingApproval"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1
    },
    mutations: {
      retry: 1
    }
  }
});

function SuspendedRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function withLayout(element: ReactNode) {
  return (
    <AppLayout>
      <SuspendedRoute>{element}</SuspendedRoute>
    </AppLayout>
  );
}

/**
 * Home guard: redireciona árbitros para o dashboard de arbitragem
 */
function HomeGuard() {
  const { user } = useAuth();
  if (user?.role === 'referee') {
    return <Navigate to="/referee/dashboard" replace />;
  }
  return withLayout(<HomePage />);
}

function AppRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route 
        path="/auth" 
        element={isAuthenticated ? <Navigate to={user?.role === 'referee' ? '/referee/dashboard' : '/'} replace /> : <SuspendedRoute><AuthPage /></SuspendedRoute>} 
      />
      
      {/* Protected Routes with TabBar */}
      <Route path="/" element={<HomeGuard />} />
      <Route path="/my-matches" element={withLayout(<TeamManagerRoute><MyMatchesPage /></TeamManagerRoute>)} />
      <Route path="/matches" element={withLayout(<MatchesPage />)} />
      <Route path="/match/:matchId" element={withLayout(<MatchDetailsPage />)} />
      <Route path="/match-lineup/:matchId" element={withLayout(<MatchLineupPage />)} />
      <Route path="/teams" element={withLayout(<TeamsPage />)} />
      <Route path="/team/:teamId" element={withLayout(<TeamDetailPage />)} />
      <Route path="/team/:teamId/roster" element={withLayout(<TeamRosterPage />)} />
      <Route path="/player/:playerId" element={withLayout(<PlayerDetailPage />)} />
      <Route path="/stats" element={withLayout(<StatsPage />)} />
      <Route path="/more" element={withLayout(<MorePage />)} />
      <Route path="/profile" element={withLayout(<ProfilePage />)} />
      <Route path="/news" element={withLayout(<NewsPage />)} />
      <Route path="/news/:newsId" element={withLayout(<NewsDetailPage />)} />
      <Route path="/community" element={withLayout(<CommunityPage />)} />
      <Route path="/community/profile/:userId" element={withLayout(<UserProfilePage />)} />
      <Route path="/favorites" element={withLayout(<FavoritesPage />)} />
      <Route path="/notifications" element={withLayout(<NotificationsPage />)} />
      <Route path="/contributions" element={withLayout(<ContributionsPage />)} />
      <Route path="/search" element={withLayout(<SearchPage />)} />
      <Route path="/compare-players" element={withLayout(<PremiumRoute><PlayerComparisonPage /></PremiumRoute>)} />
      <Route path="/journalist/request" element={withLayout(<JournalistRequestPage />)} />
      <Route path="/referees" element={withLayout(<RefereesPage />)} />
      <Route path="/admin-panel" element={withLayout(<AdminRoute><AdminPanelPage /></AdminRoute>)} />
      <Route path="/admin/audit-logs" element={withLayout(<AdminRoute><AdminAuditLogsPage /></AdminRoute>)} />

      {/* ⚽ ROTAS DO ÁRBITRO - Protegidas com RefereeRoute */}
      <Route path="/referee/dashboard" element={
        <RefereeRoute>
          <SuspendedRoute><RefereeDashboard /></SuspendedRoute>
        </RefereeRoute>
      } />
      <Route path="/referee/matches" element={
        <RefereeRoute>
          <SuspendedRoute><RefereeMatches /></SuspendedRoute>
        </RefereeRoute>
      } />
      <Route path="/referee/matches/:matchId" element={
        <RefereeRoute>
          <SuspendedRoute><MatchDetails /></SuspendedRoute>
        </RefereeRoute>
      } />
      <Route path="/referee/matches/:matchId/upload-report" element={
        <RefereeRoute>
          <SuspendedRoute><UploadReport /></SuspendedRoute>
        </RefereeRoute>
      } />
      <Route path="/referee/pending-approval" element={
        <RefereeRoute requireApproval={false}>
          <SuspendedRoute><RefereePendingApproval /></SuspendedRoute>
        </RefereeRoute>
      } />

      {/* 🛡️ ROTAS DO ADMIN - Protegidas com AdminRoute */}
      <Route path="/admin/matches" element={
        <AdminRoute>
          <SuspendedRoute><AdminMatches /></SuspendedRoute>
        </AdminRoute>
      } />
      <Route path="/admin/matches/:matchId/assign-referees" element={
        <AdminRoute>
          <SuspendedRoute><AssignReferees /></SuspendedRoute>
        </AdminRoute>
      } />
      <Route path="/admin/review" element={
        <AdminRoute>
          <SuspendedRoute><AdminReviewPage /></SuspendedRoute>
        </AdminRoute>
      } />
      <Route path="/admin/edit-requests" element={
        <AdminRoute>
          <SuspendedRoute><AdminEditRequestsPage /></SuspendedRoute>
        </AdminRoute>
      } />

      {/* 🎮 LIVE MATCH MANAGER - Protegido com AppLayout */}
      <Route path="/live-match/:matchId" element={withLayout(<TeamManagerRoute allowAdmin><LiveMatchManager /></TeamManagerRoute>)} />

      {/* 404 */}
      <Route path="*" element={<SuspendedRoute><NotFound /></SuspendedRoute>} />
    </Routes>
  );
}

const App = () => (
  <AppErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </AppErrorBoundary>
);

export default App;
