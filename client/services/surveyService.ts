import { SurveyTemplate, SurveyDistribution, SurveyQuestion } from "@/lib/survey-types";

export const surveyService = {
  async getTemplates(signal?: AbortSignal): Promise<SurveyTemplate[]> {
    const response = await fetch('/api/survey-templates', { signal });
    if (!response.ok) {
      throw new Error('Failed to load survey templates');
    }
    return response.json();
  },

  async getDistributions(signal?: AbortSignal): Promise<SurveyDistribution[]> {
    const response = await fetch('/api/survey-distributions', { signal });
    if (!response.ok) {
      throw new Error('Failed to load survey distributions');
    }
    return response.json();
  },

  async getTemplateQuestions(templateId: string): Promise<SurveyQuestion[]> {
    const response = await fetch(`/api/survey-questions/${templateId}`);
    if (!response.ok) {
      throw new Error('Failed to load template questions');
    }
    return response.json();
  },

  async createDistribution(distributionData: any): Promise<void> {
    const response = await fetch('/api/survey-distributions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(distributionData),
    });

    if (!response.ok) {
      throw new Error('Failed to create distribution');
    }
  },

  async createTemplate(templateData: Partial<SurveyTemplate>): Promise<void> {
    const response = await fetch('/api/survey-templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData),
    });

    if (!response.ok) {
      throw new Error('Failed to create template');
    }
  },

  async updateTemplate(templateId: string, templateData: Partial<SurveyTemplate>): Promise<void> {
    const response = await fetch(`/api/survey-templates/${templateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update template');
    }
  },

  async deleteTemplate(templateId: string): Promise<void> {
    const response = await fetch(`/api/survey-templates/${templateId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete template');
    }
  }
};
