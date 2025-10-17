import { SurveyTemplate, SurveyDistribution, SurveyQuestion } from "@/lib/survey-types";
import { apiClient } from '@/lib/api/api-client';
import { SURVEY_ENDPOINTS } from '@/lib/constants/api-endpoints';

export const surveyService = {
  async getTemplates(signal?: AbortSignal): Promise<SurveyTemplate[]> {
    return await apiClient.get<SurveyTemplate[]>(
      SURVEY_ENDPOINTS.TEMPLATES,
      { errorMessage: 'Anket şablonları yüklenemedi' }
    );
  },

  async getDistributions(signal?: AbortSignal): Promise<SurveyDistribution[]> {
    return await apiClient.get<SurveyDistribution[]>(
      SURVEY_ENDPOINTS.DISTRIBUTIONS,
      { errorMessage: 'Anket dağıtımları yüklenemedi' }
    );
  },

  async getTemplateQuestions(templateId: string): Promise<SurveyQuestion[]> {
    return await apiClient.get<SurveyQuestion[]>(
      SURVEY_ENDPOINTS.QUESTIONS(templateId),
      { errorMessage: 'Anket soruları yüklenemedi' }
    );
  },

  async createDistribution(distributionData: any): Promise<void> {
    return await apiClient.post<void>(
      SURVEY_ENDPOINTS.DISTRIBUTIONS,
      distributionData,
      {
        showSuccessToast: true,
        successMessage: 'Anket dağıtımı oluşturuldu',
        errorMessage: 'Anket dağıtımı oluşturulamadı',
      }
    );
  },

  async createTemplate(templateData: Partial<SurveyTemplate>): Promise<void> {
    return await apiClient.post<void>(
      SURVEY_ENDPOINTS.TEMPLATES,
      templateData,
      {
        showSuccessToast: true,
        successMessage: 'Anket şablonu oluşturuldu',
        errorMessage: 'Anket şablonu oluşturulamadı',
      }
    );
  },

  async updateTemplate(templateId: string, templateData: Partial<SurveyTemplate>): Promise<void> {
    return await apiClient.put<void>(
      SURVEY_ENDPOINTS.TEMPLATE_BY_ID(templateId),
      templateData,
      {
        showSuccessToast: true,
        successMessage: 'Anket şablonu güncellendi',
        errorMessage: 'Anket şablonu güncellenemedi',
      }
    );
  },

  async deleteTemplate(templateId: string): Promise<void> {
    return await apiClient.delete<void>(
      SURVEY_ENDPOINTS.TEMPLATE_BY_ID(templateId),
      {
        showSuccessToast: true,
        successMessage: 'Anket şablonu silindi',
        errorMessage: 'Anket şablonu silinemedi',
      }
    );
  }
};
