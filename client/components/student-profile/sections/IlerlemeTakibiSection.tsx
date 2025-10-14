import { useState } from "react";
import { Achievement, SelfAssessment, addAchievement, addSelfAssessment } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EnhancedTextarea } from "@/components/ui/enhanced-textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Heart, Trophy } from "lucide-react";

interface IlerlemeTakibiSectionProps {
  studentId: string;
  achievements: Achievement[];
  selfAssessments: SelfAssessment[];
  todaysAssessment: SelfAssessment | undefined;
  onUpdate: () => void;
}

export default function IlerlemeTakibiSection({ 
  studentId, 
  achievements, 
  selfAssessments,
  todaysAssessment,
  onUpdate 
}: IlerlemeTakibiSectionProps) {
  const [moodRating, setMoodRating] = useState<string>("5");
  const [motivationLevel, setMotivationLevel] = useState<string>("5");
  const [stressLevel, setStressLevel] = useState<string>("5");
  const [confidenceLevel, setConfidenceLevel] = useState<string>("5");
  const [todayHighlight, setTodayHighlight] = useState<string>("");
  const [todayChallenge, setTodayChallenge] = useState<string>("");

  const addExampleAchievement = () => {
    const achievement: Achievement = {
      id: crypto.randomUUID(),
      studentId,
      type: "ROZETLeR",
      title: "İlk Hedef Tamamlandı",
      description: "İlk SMART hedefini başarıyla tamamladı",
      icon: "trophy",
      color: "#FFD700",
      points: 50,
      earnedAt: new Date().toISOString(),
      category: "HEDEFLeR",
      criteria: "Bir SMART hedefi %100 tamamlama"
    };
    addAchievement(achievement);
    onUpdate();
  };

  const saveDailyAssessment = () => {
    const assessment: SelfAssessment = {
      id: crypto.randomUUID(),
      studentId,
      assessmentDate: new Date().toISOString().slice(0, 10),
      moodRating: Number(moodRating),
      motivationLevel: Number(motivationLevel),
      stressLevel: Number(stressLevel),
      confidenceLevel: Number(confidenceLevel),
      studyDifficulty: 5,
      socialInteraction: 5,
      sleepQuality: 5,
      physicalActivity: 5,
      dailyGoalsAchieved: 50,
      todayHighlight: todayHighlight || undefined,
      todayChallenge: todayChallenge || undefined,
    };
    addSelfAssessment(assessment);
    setTodayHighlight("");
    setTodayChallenge("");
    onUpdate();
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Başarı Rozetleri
          </CardTitle>
          <CardDescription>Kazanılan rozetler ve başarılar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={addExampleAchievement}>
            <Award className="mr-2 h-4 w-4" />
            Örnek Rozet Ver
          </Button>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <div key={achievement.id} className="border rounded-lg p-3 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" 
                     style={{ backgroundColor: achievement.color + "20", color: achievement.color }}>
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="font-medium text-sm">{achievement.title}</div>
                <div className="text-xs text-muted-foreground">{achievement.description}</div>
                <Badge variant="secondary">{achievement.category}</Badge>
                {achievement.points && (
                  <div className="text-xs text-muted-foreground">{achievement.points} puan</div>
                )}
                <div className="text-xs text-muted-foreground">
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Günlük Değerlendirme
          </CardTitle>
          <CardDescription>Bugünkü ruh halin ve performansın nasıldı?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {todaysAssessment ? (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="font-medium">Bugünkü Değerlendirmen Tamamlandı!</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Ruh Hali: {todaysAssessment.moodRating}/10</div>
                <div>Motivasyon: {todaysAssessment.motivationLevel}/10</div>
                <div>Stres: {todaysAssessment.stressLevel}/10</div>
                <div>Özgüven: {todaysAssessment.confidenceLevel}/10</div>
              </div>
              {todaysAssessment.todayHighlight && (
                <div className="text-sm">
                  <strong>Günün En İyisi:</strong> {todaysAssessment.todayHighlight}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-sm">Ruh Hali (1-10)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={moodRating}
                    onChange={(e) => setMoodRating(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm">Motivasyon (1-10)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={motivationLevel}
                    onChange={(e) => setMotivationLevel(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm">Stres (1-10)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm">Özgüven (1-10)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Günün En İyi Anı</label>
                <Textarea
                  placeholder="Bugün neyi başardın?"
                  value={todayHighlight}
                  onChange={(e) => setTodayHighlight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Günün Zorluğu</label>
                <Textarea
                  placeholder="Bugün hangi zorluklarla karşılaştın?"
                  value={todayChallenge}
                  onChange={(e) => setTodayChallenge(e.target.value)}
                />
              </div>

              <Button onClick={saveDailyAssessment} className="w-full">
                Günlük Değerlendirmeyi Kaydet
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Geçmiş Değerlendirmeler</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selfAssessments.slice(0, 7).map(assessment => (
                <div key={assessment.id} className="border rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      {new Date(assessment.assessmentDate).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">😊 {assessment.moodRating}/10</Badge>
                      <Badge variant="outline">💪 {assessment.motivationLevel}/10</Badge>
                    </div>
                  </div>
                  {assessment.todayHighlight && (
                    <div className="text-xs">
                      <strong>En İyi:</strong> {assessment.todayHighlight}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
