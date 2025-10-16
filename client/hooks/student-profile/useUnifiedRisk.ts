/**
 * Unified Risk Profile Hook
 * Tüm risk bilgilerini tek bir yerden sağlar
 * - Manual risk (Genel Bilgiler'den)
 * - Risk factors (Risk değerlendirmeden)
 * - Enhanced risk (AI tabanlı)
 * - Risk & Protective profile
 */

import { useQuery } from "@tanstack/react-query";
import { Student } from "@/lib/storage";
import { apiClient } from "@/lib/api/api-client";

export interface UnifiedRiskData {
  // Manuel risk (Genel Bilgiler'den)
  manualRisk: "Düşük" | "Orta" | "Yüksek" | null;
  
  // Risk faktörleri değerlendirmesi
  riskFactors: {
    assessmentDate: string;
    academicRiskLevel: string;
    behavioralRiskLevel: string;
    attendanceRiskLevel: string;
    socialEmotionalRiskLevel: string;
    academicFactors?: string;
    behavioralFactors?: string;
    protectiveFactors?: string;
    interventionsNeeded?: string;
  } | null;
  
  // AI tabanlı enhanced risk
  enhancedRisk: {
    overallScore: number;
    category: string;
    trend: "increasing" | "stable" | "decreasing";
    factors: Array<{
      factor: string;
      impact: "high" | "medium" | "low";
      description: string;
    }>;
  } | null;
  
  // Risk & Protective Profile
  riskProtectiveProfile: {
    riskScore: number;
    protectiveScore: number;
    recommendations: string[];
  } | null;
  
  // Birleştirilmiş risk skoru (0-100)
  unifiedRiskScore: number;
  
  // Risk kategorisi
  riskCategory: "low" | "medium" | "high" | "critical";
  
  // Öncelik durumu
  interventionPriority: "low" | "medium" | "high" | "critical";
}

export function useUnifiedRisk(studentId: string, student?: Student) {
  return useQuery<UnifiedRiskData>({
    queryKey: ['unified-risk', studentId],
    queryFn: async () => {
      // Manuel risk bilgisini al
      const manualRisk = student?.risk || null;
      
      // Risk faktörlerini al (API'den)
      let riskFactors = null;
      try {
        riskFactors = await apiClient.get(`/api/risk-assessment/${studentId}`);
      } catch (error) {
        console.error('Risk factors fetch error:', error);
      }
      
      // Enhanced risk'i al (AI tabanlı)
      let enhancedRisk = null;
      try {
        enhancedRisk = await apiClient.get(`/api/enhanced-risk/${studentId}`);
      } catch (error) {
        console.error('Enhanced risk fetch error:', error);
      }
      
      // Risk & Protective profile'ı al
      let riskProtectiveProfile = null;
      try {
        riskProtectiveProfile = await apiClient.get(`/api/student-profile/${studentId}/risk-protective`);
      } catch (error) {
        console.error('Risk protective profile fetch error:', error);
      }
      
      // Birleştirilmiş risk skorunu hesapla
      const unifiedRiskScore = calculateUnifiedRiskScore({
        manualRisk,
        riskFactors,
        enhancedRisk,
        riskProtectiveProfile
      });
      
      // Risk kategorisini belirle
      const riskCategory = getRiskCategory(unifiedRiskScore);
      
      // Müdahale önceliğini belirle
      const interventionPriority = getInterventionPriority(
        unifiedRiskScore,
        riskFactors,
        enhancedRisk
      );
      
      return {
        manualRisk,
        riskFactors,
        enhancedRisk,
        riskProtectiveProfile,
        unifiedRiskScore,
        riskCategory,
        interventionPriority,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
    enabled: !!studentId,
  });
}

// Birleştirilmiş risk skorunu hesapla
function calculateUnifiedRiskScore(data: {
  manualRisk: string | null;
  riskFactors: any;
  enhancedRisk: any;
  riskProtectiveProfile: any;
}): number {
  const scores: number[] = [];
  
  // Manuel risk'i skora çevir
  if (data.manualRisk) {
    const manualScore = {
      "Düşük": 20,
      "Orta": 50,
      "Yüksek": 80
    }[data.manualRisk] || 0;
    scores.push(manualScore);
  }
  
  // Risk faktörlerinden skor hesapla
  if (data.riskFactors) {
    const levelToScore = {
      "DÜŞÜK": 20,
      "ORTA": 50,
      "YÜKSEK": 75,
      "ÇOK_YÜKSEK": 95
    };
    
    const factorScores = [
      levelToScore[data.riskFactors.academicRiskLevel as keyof typeof levelToScore] || 0,
      levelToScore[data.riskFactors.behavioralRiskLevel as keyof typeof levelToScore] || 0,
      levelToScore[data.riskFactors.attendanceRiskLevel as keyof typeof levelToScore] || 0,
      levelToScore[data.riskFactors.socialEmotionalRiskLevel as keyof typeof levelToScore] || 0,
    ];
    
    const avgFactorScore = factorScores.reduce((a, b) => a + b, 0) / factorScores.length;
    scores.push(avgFactorScore);
  }
  
  // Enhanced risk skorunu ekle
  if (data.enhancedRisk?.overallScore) {
    scores.push(data.enhancedRisk.overallScore);
  }
  
  // Risk protective profile'dan risk skorunu ekle
  if (data.riskProtectiveProfile?.riskScore) {
    scores.push(data.riskProtectiveProfile.riskScore);
  }
  
  // Ortalama hesapla
  if (scores.length === 0) return 0;
  
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// Risk kategorisini belirle
function getRiskCategory(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}

// Müdahale önceliğini belirle
function getInterventionPriority(
  score: number,
  riskFactors: any,
  enhancedRisk: any
): "low" | "medium" | "high" | "critical" {
  // Çok yüksek risk faktörleri varsa kritik
  if (riskFactors?.behavioralRiskLevel === "ÇOK_YÜKSEK" ||
      riskFactors?.academicRiskLevel === "ÇOK_YÜKSEK") {
    return "critical";
  }
  
  // Enhanced risk trend'i artıyorsa öncelik yükselir
  if (enhancedRisk?.trend === "increasing" && score >= 50) {
    return score >= 70 ? "critical" : "high";
  }
  
  // Normal kategori
  return getRiskCategory(score);
}
