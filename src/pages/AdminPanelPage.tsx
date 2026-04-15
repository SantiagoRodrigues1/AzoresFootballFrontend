// src/pages/AdminPanelPage.tsx
import { useState } from 'react';
import { BarChart3, History, Download, Users, Trophy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IonButton, IonTabs, IonTabBar, IonIcon, IonTabButton, IonLabel } from '@ionic/react';
import { AdminDashboardPage } from './AdminDashboardPage';
import { AdminAuditLogsPage } from './AdminAuditLogsPage';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/services/api';

export function AdminPanelPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleExport = async (format: 'json' | 'csv', type: 'full' | 'clubs' | 'matches' | 'referees' = 'full') => {
    try {
      const url = new URL(`${API_URL}/admin/dashboard/export/${format}`);
      url.searchParams.set('type', type);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao exportar');

      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `export-${Date.now()}.${format === 'csv' ? 'csv' : 'json'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      alert('Erro ao exportar dados');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.12),_transparent_35%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] pb-24">
      {/* Header Global */}
      <header className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 sticky top-0 z-50 shadow-lg safe-top rounded-b-3xl overflow-hidden px-4 pt-6 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-sm text-white/70">Gestão Profissional do Sistema</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <IonButton
            size="small"
            fill="outline"
            className="text-white border-white whitespace-nowrap"
            onClick={() => handleExport('csv', 'full')}
          >
            <Download className="w-4 h-4 mr-1" />
            CSV Completo
          </IonButton>
          <IonButton
            size="small"
            fill="outline"
            className="text-white border-white whitespace-nowrap"
            onClick={() => handleExport('json', 'full')}
          >
            <Download className="w-4 h-4 mr-1" />
            JSON
          </IonButton>
          <IonButton
            size="small"
            fill="outline"
            className="text-white border-white whitespace-nowrap"
            onClick={() => handleExport('csv', 'clubs')}
          >
            Export Equipas
          </IonButton>
        </div>
      </header>

      {/* Main Content */}
      <IonTabs>
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && <AdminDashboardPage />}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && <AdminAuditLogsPage />}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="px-4 py-6">
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6 text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Estatísticas avançadas em breve</p>
              <p className="text-sm text-slate-500">Gráficos de performance, distribuição geográfica, e métricas detalhadas</p>
            </div>
          </div>
        )}

        {/* TABBar Navigation */}
        <IonTabBar slot="bottom" color="light" className="flex gap-2 justify-around p-4 bg-card border-t border-border sticky bottom-0 z-40">
          <IonTabButton
            tab="dashboard"
            selected={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            className="flex flex-col items-center p-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <BarChart3 className={`w-6 h-6 ${activeTab === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`} />
            <IonLabel className="text-xs">Dashboard</IonLabel>
          </IonTabButton>

          <IonTabButton
            tab="stats"
            selected={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            className="flex flex-col items-center p-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Trophy className={`w-6 h-6 ${activeTab === 'stats' ? 'text-primary' : 'text-muted-foreground'}`} />
            <IonLabel className="text-xs">Estatísticas</IonLabel>
          </IonTabButton>

          <IonTabButton
            tab="audit"
            selected={activeTab === 'audit'}
            onClick={() => setActiveTab('audit')}
            className="flex flex-col items-center p-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <History className={`w-6 h-6 ${activeTab === 'audit' ? 'text-primary' : 'text-muted-foreground'}`} />
            <IonLabel className="text-xs">Auditoria</IonLabel>
          </IonTabButton>

          <IonTabButton
            tab="management"
            className="flex flex-col items-center p-3 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => navigate('/teams')}
          >
            <Users className="w-6 h-6 text-muted-foreground" />
            <IonLabel className="text-xs">Equipas</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </div>
  );
}
