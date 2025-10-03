import { useState, useEffect } from "react";
import {
  MeetingNote,
  SurveyResult,
  AttendanceRecord,
  AcademicRecord,
  Intervention,
  CoachingRecommendation,
  MultipleIntelligence,
  LearningStyle,
  AcademicGoal,
  SmartGoal,
  Evaluation360,
  Achievement,
  SelfAssessment,
  ParentMeeting,
  HomeVisit,
  FamilyParticipation,
  HealthInfo,
  SpecialEducation,
  RiskFactors,
  BehaviorIncident,
  ExamResult,
  getNotesByStudent,
  getSurveyResultsByStudent,
  getAttendanceByStudent,
  getAcademicsByStudent,
  getInterventionsByStudent,
  getCoachingRecommendationsByStudent,
  getAcademicGoalsByStudent,
  getMultipleIntelligenceByStudent,
  getLearningStyleByStudent,
  getSmartGoalsByStudent,
  getEvaluations360ByStudent,
  getAchievementsByStudent,
  getSelfAssessmentsByStudent,
  getTodaysSelfAssessment,
  getParentMeetingsByStudent,
  getHomeVisitsByStudent,
  getFamilyParticipationByStudent,
  getHealthInfoByStudent,
  getSpecialEducationByStudent,
  getLatestRiskFactors,
  getBehaviorIncidentsByStudent,
  getExamResultsByStudent,
} from "@/lib/storage";

export interface StudentData {
  notes: MeetingNote[];
  surveyResults: SurveyResult[];
  attendanceRecords: AttendanceRecord[];
  academicRecords: AcademicRecord[];
  interventions: Intervention[];
  healthInfo: HealthInfo | null;
  specialEducation: SpecialEducation[];
  riskFactors: RiskFactors | null;
  behaviorIncidents: BehaviorIncident[];
  examResults: ExamResult[];
  coachingRecommendations: CoachingRecommendation[];
  academicGoals: AcademicGoal[];
  multipleIntelligence: MultipleIntelligence | null;
  learningStyle: LearningStyle | null;
  smartGoals: SmartGoal[];
  evaluations360: Evaluation360[];
  achievements: Achievement[];
  selfAssessments: SelfAssessment[];
  todaysAssessment: SelfAssessment | undefined;
  parentMeetings: ParentMeeting[];
  homeVisits: HomeVisit[];
  familyParticipation: FamilyParticipation[];
}

const initialStudentData: StudentData = {
  notes: [],
  surveyResults: [],
  attendanceRecords: [],
  academicRecords: [],
  interventions: [],
  healthInfo: null,
  specialEducation: [],
  riskFactors: null,
  behaviorIncidents: [],
  examResults: [],
  coachingRecommendations: [],
  academicGoals: [],
  multipleIntelligence: null,
  learningStyle: null,
  smartGoals: [],
  evaluations360: [],
  achievements: [],
  selfAssessments: [],
  todaysAssessment: undefined,
  parentMeetings: [],
  homeVisits: [],
  familyParticipation: [],
};

export function useStudentData(studentId: string | undefined, refresh: number) {
  const [data, setData] = useState<StudentData>(initialStudentData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!studentId) {
      setData(initialStudentData);
      return;
    }

    setIsLoading(true);

    Promise.all([
      getNotesByStudent(studentId),
      getSurveyResultsByStudent(studentId),
      getAttendanceByStudent(studentId),
      getAcademicsByStudent(studentId),
      getInterventionsByStudent(studentId),
      getHealthInfoByStudent(studentId),
      getSpecialEducationByStudent(studentId),
      getLatestRiskFactors(studentId),
      getBehaviorIncidentsByStudent(studentId),
      getExamResultsByStudent(studentId),
      getCoachingRecommendationsByStudent(studentId),
      getAcademicGoalsByStudent(studentId),
      getMultipleIntelligenceByStudent(studentId),
      getLearningStyleByStudent(studentId),
      getSmartGoalsByStudent(studentId),
      getEvaluations360ByStudent(studentId),
      getAchievementsByStudent(studentId),
      getSelfAssessmentsByStudent(studentId),
      getTodaysSelfAssessment(studentId),
      getParentMeetingsByStudent(studentId),
      getHomeVisitsByStudent(studentId),
      getFamilyParticipationByStudent(studentId),
    ])
      .then(([
        notes,
        surveyResults,
        attendanceRecords,
        academicRecords,
        interventions,
        healthInfo,
        specialEducation,
        riskFactors,
        behaviorIncidents,
        examResults,
        coachingRecommendations,
        academicGoals,
        multipleIntelligence,
        learningStyle,
        smartGoals,
        evaluations360,
        achievements,
        selfAssessments,
        todaysAssessment,
        parentMeetings,
        homeVisits,
        familyParticipation,
      ]) => {
        setData({
          notes,
          surveyResults,
          attendanceRecords,
          academicRecords,
          interventions,
          healthInfo,
          specialEducation,
          riskFactors,
          behaviorIncidents,
          examResults,
          coachingRecommendations,
          academicGoals,
          multipleIntelligence,
          learningStyle,
          smartGoals,
          evaluations360,
          achievements,
          selfAssessments,
          todaysAssessment,
          parentMeetings,
          homeVisits,
          familyParticipation,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading student data:", error);
        setIsLoading(false);
      });
  }, [studentId, refresh]);

  return { data, isLoading };
}
