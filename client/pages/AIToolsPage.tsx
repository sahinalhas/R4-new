import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert, Bot, Brain, Sparkles, CalendarDays } from 'lucide-react';
import RiskDashboard from './RiskDashboard';
import AIAssistant from './AIAssistant';
import AIInsightsDashboard from './AIInsightsDashboard';
import AdvancedAIAnalysis from './AdvancedAIAnalysis';
import DailyActionPlan from './DailyActionPlan';

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState('risk');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Araçları</h1>
        <p className="text-muted-foreground mt-2">
          Yapay zeka destekli analiz, raporlama ve asistan araçları
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">Risk Takip</span>
          </TabsTrigger>
          <TabsTrigger value="ai-asistan" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI Asistan</span>
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Günlük AI</span>
          </TabsTrigger>
          <TabsTrigger value="gelismis-analiz" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Derinlemesine</span>
          </TabsTrigger>
          <TabsTrigger value="gunluk-plan" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Günlük Plan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="risk" className="mt-0">
          <RiskDashboard />
        </TabsContent>

        <TabsContent value="ai-asistan" className="mt-0">
          <AIAssistant />
        </TabsContent>

        <TabsContent value="ai-insights" className="mt-0">
          <AIInsightsDashboard />
        </TabsContent>

        <TabsContent value="gelismis-analiz" className="mt-0">
          <AdvancedAIAnalysis />
        </TabsContent>

        <TabsContent value="gunluk-plan" className="mt-0">
          <DailyActionPlan />
        </TabsContent>
      </Tabs>
    </div>
  );
}
