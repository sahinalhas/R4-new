/**
 * AI Tools Hub
 * Tüm AI araçlarını tek bir yerde toplar
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Shield, Sparkles, FileText, Mail, Activity } from "lucide-react";
import InterventionRecommendations from "@/components/ai/InterventionRecommendations";
import AutoReportGenerator from "@/components/ai/AutoReportGenerator";
import ParentCommunication from "@/components/ai/ParentCommunication";
import { VoiceRecorder } from "@/components/voice/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiClient } from "@/lib/api/api-client";
import { AI_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { Loader2 } from "lucide-react";

interface AIToolsHubProps {
  studentId: string;
  studentName: string;
  onUpdate?: () => void;
}

export default function AIToolsHub({ studentId, studentName, onUpdate }: AIToolsHubProps) {
  const navigate = useNavigate();
  const [analyzingRisk, setAnalyzingRisk] = useState(false);

  const handleAIChat = () => {
    navigate(`/ai-asistan?student=${studentId}`);
  };

  const handleRiskAnalysis = async () => {
    setAnalyzingRisk(true);
    try {
      await apiClient.post(
        AI_ENDPOINTS.ANALYZE_RISK,
        { studentId },
        {
          showSuccessToast: true,
          successMessage: 'Risk analizi tamamlandı',
          showErrorToast: true,
        }
      );
      
      navigate(`/ai-asistan?student=${studentId}&action=risk`);
    } catch (error) {
      console.error('Risk analysis error:', error);
    } finally {
      setAnalyzingRisk(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Araçları Sekmeleri */}
      <Tabs defaultValue="mudahale" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-4 gap-2 h-auto">
          <TabsTrigger value="mudahale" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Müdahale Önerileri
          </TabsTrigger>
          <TabsTrigger value="raporlar" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Otomatik Raporlar
          </TabsTrigger>
          <TabsTrigger value="veli-iletisim" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Veli İletişimi
          </TabsTrigger>
          <TabsTrigger value="sesli-not" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Sesli Not
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mudahale" className="space-y-4">
          <InterventionRecommendations
            studentId={studentId}
            studentName={studentName}
          />
        </TabsContent>

        <TabsContent value="raporlar" className="space-y-4">
          <AutoReportGenerator
            studentId={studentId}
            studentName={studentName}
          />
        </TabsContent>

        <TabsContent value="veli-iletisim" className="space-y-4">
          <ParentCommunication
            studentId={studentId}
            studentName={studentName}
          />
        </TabsContent>

        <TabsContent value="sesli-not" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sesli Not ve AI Analizi</CardTitle>
              <CardDescription>
                Öğrenci ile ilgili sesli not alın, otomatik transkript ve AI analizi alın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceRecorder
                studentId={studentId}
                sessionType="INDIVIDUAL"
                onTranscriptionComplete={(result) => {
                  console.log('Voice note completed:', result);
                  onUpdate?.();
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hızlı Eylemler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Hızlı AI Eylemleri
          </CardTitle>
          <CardDescription>
            Öğrenci analizi için AI araçlarına hızlı erişim
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAIChat} className="gap-2">
              <Bot className="h-4 w-4" />
              AI ile Konuş
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRiskAnalysis}
              disabled={analyzingRisk}
              className="gap-2"
            >
              {analyzingRisk ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              Risk Analizi Yap
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
