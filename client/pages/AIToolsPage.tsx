import { useState, useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert, Bot, Brain, Sparkles, CalendarDays } from 'lucide-react';
import { AIToolsLoadingState } from '@/components/ai-tools/AIToolsLoadingState';

const RiskDashboard = lazy(() => import('./RiskDashboard'));
const AIAssistant = lazy(() => import('./AIAssistant'));
const AIInsightsDashboard = lazy(() => import('./AIInsightsDashboard'));
const AdvancedAIAnalysis = lazy(() => import('./AdvancedAIAnalysis'));
const DailyActionPlan = lazy(() => import('./DailyActionPlan'));

const AI_TOOLS_TABS = [
  {
    value: 'risk',
    label: 'Risk Takip',
    icon: ShieldAlert,
    description: 'Risk analizi ve takip araçları'
  },
  {
    value: 'ai-asistan',
    label: 'AI Asistan',
    icon: Bot,
    description: 'Yapay zeka destekli asistan'
  },
  {
    value: 'ai-insights',
    label: 'Günlük AI',
    icon: Brain,
    description: 'Günlük yapay zeka içgörüleri'
  },
  {
    value: 'gelismis-analiz',
    label: 'Derinlemesine',
    icon: Sparkles,
    description: 'Gelişmiş analiz araçları'
  },
  {
    value: 'gunluk-plan',
    label: 'Günlük Plan',
    icon: CalendarDays,
    description: 'Günlük eylem planı'
  }
] as const;

const VALID_TABS = ['risk', 'ai-asistan', 'ai-insights', 'gelismis-analiz', 'gunluk-plan'] as const;

export default function AIToolsPage() {
  const [searchParams] = useSearchParams();
  
  // Read initial tab from URL, but default to 'risk' if invalid
  const getValidTab = (tab: string | null): string => {
    if (tab && VALID_TABS.includes(tab as any)) {
      return tab;
    }
    return 'risk';
  };

  const initialTab = getValidTab(searchParams.get('tab'));
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update active tab if URL changes (e.g., from navigation)
  // Only watch searchParams, not activeTab, to avoid reverting user's manual tab changes
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    const validTab = getValidTab(urlTab);
    setActiveTab(validTab);
  }, [searchParams]);

  // Handle tab change - only update local state, don't modify URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      {/* Modern Header with Gradient */}
      <div className="rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">AI Araçları</h1>
            <p className="text-muted-foreground mt-2">
              Yapay zeka destekli analiz, raporlama ve asistan araçları
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        {/* Responsive Tab List */}
        <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start min-h-[2.5rem] bg-muted/50 p-1">
          {AI_TOOLS_TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger 
              key={value} 
              value={value} 
              className="flex items-center gap-2 shrink-0 data-[state=active]:bg-background"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="risk" className="mt-0 min-h-[600px]">
          <Suspense fallback={<AIToolsLoadingState icon={ShieldAlert} message="Risk verileri yükleniyor..." />}>
            <RiskDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="ai-asistan" className="mt-0 min-h-[600px]">
          <Suspense fallback={<AIToolsLoadingState icon={Bot} message="AI Asistan yükleniyor..." />}>
            <AIAssistant />
          </Suspense>
        </TabsContent>

        <TabsContent value="ai-insights" className="mt-0 min-h-[600px]">
          <Suspense fallback={<AIToolsLoadingState icon={Brain} message="Günlük insights yükleniyor..." />}>
            <AIInsightsDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="gelismis-analiz" className="mt-0 min-h-[600px]">
          <Suspense fallback={<AIToolsLoadingState icon={Sparkles} message="Gelişmiş analiz yükleniyor..." />}>
            <AdvancedAIAnalysis />
          </Suspense>
        </TabsContent>

        <TabsContent value="gunluk-plan" className="mt-0 min-h-[600px]">
          <Suspense fallback={<AIToolsLoadingState icon={CalendarDays} message="Günlük plan yükleniyor..." />}>
            <DailyActionPlan />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
