import { RequestHandler } from "express";
import { loadSubjects, saveSubjects, loadTopics, saveTopics } from "../lib/db-service.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/errors.js";

// GET /api/subjects - Tüm dersleri getir
export const getSubjects: RequestHandler = (req, res) => {
  try {
    const subjects = loadSubjects();
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ success: false, error: ERROR_MESSAGES.FAILED_TO_FETCH_SUBJECTS });
  }
};

// POST /api/subjects - Dersleri kaydet
export const saveSubjectsHandler: RequestHandler = (req, res) => {
  try {
    const subjects = req.body;
    if (!Array.isArray(subjects)) {
      return res.status(400).json({ error: ERROR_MESSAGES.EXPECTED_ARRAY_OF_SUBJECTS });
    }
    saveSubjects(subjects);
    res.json({ success: true, message: `${subjects.length} ${SUCCESS_MESSAGES.SUBJECTS_SAVED}` });
  } catch (error) {
    console.error('Error saving subjects:', error);
    res.status(500).json({ success: false, error: ERROR_MESSAGES.FAILED_TO_SAVE_SUBJECTS });
  }
};

// GET /api/topics - Tüm konuları getir
export const getTopics: RequestHandler = (req, res) => {
  try {
    const topics = loadTopics();
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ success: false, error: ERROR_MESSAGES.FAILED_TO_FETCH_TOPICS });
  }
};

// GET /api/subjects/:id/topics - Belirli bir derse ait konuları getir
export const getTopicsBySubjectId: RequestHandler = (req, res) => {
  try {
    const subjectId = req.params.id;
    if (!subjectId) {
      return res.status(400).json({ error: 'Subject ID is required' });
    }
    const allTopics = loadTopics();
    const filteredTopics = allTopics.filter(topic => topic.subjectId === subjectId);
    res.json(filteredTopics);
  } catch (error) {
    console.error('Error fetching topics by subject:', error);
    res.status(500).json({ success: false, error: ERROR_MESSAGES.FAILED_TO_FETCH_TOPICS });
  }
};

// POST /api/topics - Konuları kaydet
export const saveTopicsHandler: RequestHandler = (req, res) => {
  try {
    const topics = req.body;
    if (!Array.isArray(topics)) {
      return res.status(400).json({ error: ERROR_MESSAGES.EXPECTED_ARRAY_OF_TOPICS });
    }
    saveTopics(topics);
    res.json({ success: true, message: `${topics.length} ${SUCCESS_MESSAGES.TOPICS_SAVED}` });
  } catch (error) {
    console.error('Error saving topics:', error);
    res.status(500).json({ success: false, error: ERROR_MESSAGES.FAILED_TO_SAVE_TOPICS });
  }
};