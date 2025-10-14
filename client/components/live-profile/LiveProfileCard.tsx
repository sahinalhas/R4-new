/**
 * Live Profile Card Component
 * "Öğrenci Kimdir?" - Canlı öğrenci kimlik kartı
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  RefreshCw,
  Heart,
  BookOpen,
  Activity,
  Target
} from "lucide-react";
import { useLiveProfile } from "@/hooks/live-profile/useLiveProfile";
import { cn } from "@/lib/utils";

interface LiveProfileCardProps {
  studentId: string;
  compact?: boolean;
}

export default function LiveProfileCard({ studentId, compact = false }: LiveProfileCardProps) {
  const { identity, isLoading, refresh, isRefreshing } = useLiveProfile(studentId);

  if (isLoading) {
    return (
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!identity) {
    return (
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Canlı Profil
          </CardTitle>
          <CardDescription>Profil henüz oluşturulmadı</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refresh()} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Profil Oluştur
          </Button>
        </CardContent>
      </Card>
    );
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    high: 'bg-orange-100 text-orange-700 border-orange-300',
    critical: 'bg-red-100 text-red-700 border-red-300',
  };

  const priorityIcons = {
    low: TrendingUp,
    medium: Target,
    high: AlertTriangle,
    critical: AlertTriangle,
  };

  const PriorityIcon = priorityIcons[identity.interventionPriority];

  return (
    <Card className={cn(
      "border-2 transition-all duration-300",
      identity.interventionPriority === 'critical' ? 'border-red-400 shadow-lg shadow-red-100' : 
      identity.interventionPriority === 'high' ? 'border-orange-400 shadow-lg shadow-orange-100' :
      'border-blue-400 shadow-lg shadow-blue-100'
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-6 w-6 text-blue-600" />
              Canlı Öğrenci Profili
            </CardTitle>
            <CardDescription className="mt-1">
              Son güncelleme: {new Date(identity.lastUpdated).toLocaleString('tr-TR')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={cn("border-2", priorityColors[identity.interventionPriority])}>
              <PriorityIcon className="h-3 w-3 mr-1" />
              {identity.interventionPriority === 'critical' ? 'KRİTİK' :
               identity.interventionPriority === 'high' ? 'YÜKSEK ÖNCELİK' :
               identity.interventionPriority === 'medium' ? 'ORTA' : 'NORMAL'}
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refresh()}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Kim Bu Öğrenci? */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <Brain className="h-6 w-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Kim Bu Öğrenci?</h3>
              <p className="text-gray-700 leading-relaxed">{identity.summary}</p>
            </div>
          </div>
        </div>

        {/* Anlık Durum */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-start gap-3">
            <Activity className="h-6 w-6 text-green-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Şu Anki Durum</h3>
              <p className="text-gray-700">{identity.currentState}</p>
            </div>
          </div>
        </div>

        {!compact && (
          <>
            {/* Profil Skorları */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    Akademik
                  </span>
                  <span className="text-sm font-bold text-blue-600">{identity.academicScore}%</span>
                </div>
                <Progress value={identity.academicScore} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Heart className="h-4 w-4 text-pink-600" />
                    Sosyal-Duygusal
                  </span>
                  <span className="text-sm font-bold text-pink-600">{identity.socialEmotionalScore}%</span>
                </div>
                <Progress value={identity.socialEmotionalScore} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Target className="h-4 w-4 text-purple-600" />
                    Motivasyon
                  </span>
                  <span className="text-sm font-bold text-purple-600">{identity.motivationScore}%</span>
                </div>
                <Progress value={identity.motivationScore} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    Risk Seviyesi
                  </span>
                  <span className="text-sm font-bold text-orange-600">{identity.riskLevel}%</span>
                </div>
                <Progress value={identity.riskLevel} className="h-2" />
              </div>
            </div>

            {/* Güçlü Yönler & Zorluklar */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-green-700 mb-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Güçlü Yönler
                </h4>
                <ul className="space-y-1">
                  {identity.strengths.slice(0, 3).map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-1">
                      <span className="text-green-600">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-orange-700 mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Zorluklar
                </h4>
                <ul className="space-y-1">
                  {identity.challenges.slice(0, 3).map((challenge, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-1">
                      <span className="text-orange-600">•</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Önerileri */}
            {identity.recommendedActions.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                <h4 className="font-semibold text-sm text-amber-800 mb-3 flex items-center gap-1">
                  <Lightbulb className="h-4 w-4" />
                  AI Önerileri
                </h4>
                <ul className="space-y-2">
                  {identity.recommendedActions.slice(0, 3).map((action, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-amber-600 font-bold">{idx + 1}.</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
