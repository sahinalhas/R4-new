import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert, Bot, Brain, Sparkles, CalendarDays } from 'lucide-react';
import RiskDashboard from './RiskDashboard';
import AIAssistant from './AIAssistant';
import AIInsightsDashboard from './AIInsightsDashboard';
import AdvancedAIAnalysis from './AdvancedAIAnalysis';
import DailyActionPlan from './DailyActionPlan';

const VALID_TABS = ['risk', 'ai-asistan', 'ai-insights', 'gelismis-analiz', 'gunluk-plan'] as const;

export default function AIToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const getValidTab = (tab: string | null): string => {
    if (tab && VALID_TABS.includes(tab as any)) {
      return tab;
    }
    return 'risk';
  };

  const [activeTab, setActiveTab] = useState(getValidTab(searchParams.get('tab')));

  useEffect(() => {
    const tab = searchParams.get('tab');
    const validTab = getValidTab(tab);
    if (validTab !== activeTab) {
      setActiveTab(validTab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Araçları</h1>
        <p className="text-muted-foreground mt-2">
          Yapay zeka destekli analiz, raporlama ve asistan araçları
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 min-h-[2.5rem]">
          <TabsTrigger value="risk" className="flex items-center gap-2 justify-center">
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">Risk Takip</span>
          </TabsTrigger>
          <TabsTrigger value="ai-asistan" className="flex items-center gap-2 justify-center">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI Asistan</span>
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2 justify-center">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Günlük AI</span>
          </TabsTrigger>
          <TabsTrigger value="gelismis-analiz" className="flex items-center gap-2 justify-center">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Derinlemesine</span>
          </TabsTrigger>
          <TabsTrigger value="gunluk-plan" className="flex items-center gap-2 justify-center">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Günlük Plan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="risk" className="mt-0 min-h-[400px]">
          <RiskDashboard />
        </TabsContent>

        <TabsContent value="ai-asistan" className="mt-0 min-h-[400px]">
          <AIAssistant />
        </TabsContent>

        <TabsContent value="ai-insights" className="mt-0 min-h-[400px]">
          <AIInsightsDashboard />
        </TabsContent>

        <TabsContent value="gelismis-analiz" className="mt-0 min-h-[400px]">
          <AdvancedAIAnalysis />
        </TabsContent>

        <TabsContent value="gunluk-plan" className="mt-0 min-h-[400px]">
          <DailyActionPlan />
        </TabsContent>
      </Tabs>
    </div>
  );
}
