import { Router } from 'express';
import { randomUUID } from 'crypto';
import { StandardizedProfileRepository } from '../repository/standardized-profile.repository';
import { AggregateScoreCalculator } from '../services/aggregate-score-calculator.service';
import getDatabase from '@/server/lib/database';

const router = Router();

router.get('/:studentId/academic', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    const profile = repo.getAcademicProfile(studentId);
    
    res.json(profile || {});
  } catch (error) {
    console.error('Error fetching academic profile:', error);
    res.status(500).json({ error: 'Failed to fetch academic profile' });
  }
});

router.post('/:studentId/academic', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    
    const profile = {
      ...req.body,
      studentId,
      id: req.body.id || randomUUID(),
    };
    
    repo.upsertAcademicProfile(profile);
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving academic profile:', error);
    res.status(500).json({ error: 'Failed to save academic profile' });
  }
});

router.get('/:studentId/social-emotional', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    const profile = repo.getSocialEmotionalProfile(studentId);
    
    res.json(profile || {});
  } catch (error) {
    console.error('Error fetching social-emotional profile:', error);
    res.status(500).json({ error: 'Failed to fetch social-emotional profile' });
  }
});

router.post('/:studentId/social-emotional', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    
    const profile = {
      ...req.body,
      studentId,
      id: req.body.id || randomUUID(),
    };
    
    repo.upsertSocialEmotionalProfile(profile);
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving social-emotional profile:', error);
    res.status(500).json({ error: 'Failed to save social-emotional profile' });
  }
});

router.get('/:studentId/talents-interests', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    const profile = repo.getTalentsInterestsProfile(studentId);
    
    res.json(profile || {});
  } catch (error) {
    console.error('Error fetching talents-interests profile:', error);
    res.status(500).json({ error: 'Failed to fetch talents-interests profile' });
  }
});

router.post('/:studentId/talents-interests', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    
    const profile = {
      ...req.body,
      studentId,
      id: req.body.id || randomUUID(),
    };
    
    repo.upsertTalentsInterestsProfile(profile);
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving talents-interests profile:', error);
    res.status(500).json({ error: 'Failed to save talents-interests profile' });
  }
});

router.get('/:studentId/health', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    const profile = repo.getStandardizedHealthProfile(studentId);
    
    res.json(profile || {});
  } catch (error) {
    console.error('Error fetching health profile:', error);
    res.status(500).json({ error: 'Failed to fetch health profile' });
  }
});

router.post('/:studentId/health', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    
    const profile = {
      ...req.body,
      studentId,
      id: req.body.id || randomUUID(),
    };
    
    repo.upsertStandardizedHealthProfile(profile);
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving health profile:', error);
    res.status(500).json({ error: 'Failed to save health profile' });
  }
});

router.get('/:studentId/interventions', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    const interventions = repo.getStandardizedInterventions(studentId);
    
    res.json(interventions);
  } catch (error) {
    console.error('Error fetching interventions:', error);
    res.status(500).json({ error: 'Failed to fetch interventions' });
  }
});

router.post('/:studentId/interventions', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    
    const intervention = {
      ...req.body,
      studentId,
      id: req.body.id || randomUUID(),
    };
    
    repo.insertStandardizedIntervention(intervention);
    res.json({ success: true, intervention });
  } catch (error) {
    console.error('Error saving intervention:', error);
    res.status(500).json({ error: 'Failed to save intervention' });
  }
});

router.get('/:studentId/behavior-incidents', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    const incidents = repo.getStandardizedBehaviorIncidents(studentId);
    
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching behavior incidents:', error);
    res.status(500).json({ error: 'Failed to fetch behavior incidents' });
  }
});

router.post('/:studentId/behavior-incident', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    
    const incident = {
      ...req.body,
      studentId,
      id: req.body.id || randomUUID(),
    };
    
    repo.insertStandardizedBehaviorIncident(incident);
    res.json({ success: true, incident });
  } catch (error) {
    console.error('Error saving behavior incident:', error);
    res.status(500).json({ error: 'Failed to save behavior incident' });
  }
});

router.delete('/:studentId/behavior-incident/:incidentId', (req, res) => {
  try {
    const { incidentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    
    repo.deleteStandardizedBehaviorIncident(incidentId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting behavior incident:', error);
    res.status(500).json({ error: 'Failed to delete behavior incident' });
  }
});

router.get('/:studentId/aggregate', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    const calculator = new AggregateScoreCalculator();
    
    const academic = repo.getAcademicProfile(studentId);
    const socialEmotional = repo.getSocialEmotionalProfile(studentId);
    const talentsInterests = repo.getTalentsInterestsProfile(studentId);
    const health = repo.getHealthProfile(studentId);
    const behaviorIncidents = repo.getStandardizedBehaviorIncidents(studentId);
    const motivation = repo.getMotivationProfile(studentId);
    const riskProtective = repo.getRiskProtectiveProfile(studentId);
    const interventions = repo.getStandardizedInterventions(studentId);
    
    const aggregateScores = calculator.calculateAggregateScores({
      academic,
      socialEmotional,
      talentsInterests,
      health,
      behaviorIncidents,
      motivation,
      riskProtective
    });
    
    const aiReadyProfile = {
      studentId,
      profiles: {
        academic,
        socialEmotional,
        talentsInterests,
        health,
        behaviorIncidents,
        motivation,
        riskProtective,
        interventions
      },
      aggregateScores,
      metadata: {
        generatedAt: new Date().toISOString(),
        profileCompleteness: {
          academic: !!academic,
          socialEmotional: !!socialEmotional,
          talentsInterests: !!talentsInterests,
          health: !!health,
          behavior: behaviorIncidents.length > 0,
          motivation: !!motivation,
          riskProtective: !!riskProtective,
          interventions: interventions.length > 0
        }
      }
    };
    
    res.json(aiReadyProfile);
  } catch (error) {
    console.error('Error generating aggregate profile:', error);
    res.status(500).json({ error: 'Failed to generate aggregate profile' });
  }
});

router.post('/:studentId/motivation', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    
    const profile = {
      ...req.body,
      studentId,
      id: req.body.id || randomUUID(),
    };
    
    repo.upsertMotivationProfile(profile);
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving motivation profile:', error);
    res.status(500).json({ error: 'Failed to save motivation profile' });
  }
});

router.get('/:studentId/motivation', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    const profile = repo.getMotivationProfile(studentId);
    
    res.json(profile || {});
  } catch (error) {
    console.error('Error fetching motivation profile:', error);
    res.status(500).json({ error: 'Failed to fetch motivation profile' });
  }
});

router.post('/:studentId/risk-protective', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    
    const profile = {
      ...req.body,
      studentId,
      id: req.body.id || randomUUID(),
    };
    
    repo.upsertRiskProtectiveProfile(profile);
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving risk/protective profile:', error);
    res.status(500).json({ error: 'Failed to save risk/protective profile' });
  }
});

router.get('/:studentId/risk-protective', (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const repo = new StandardizedProfileRepository(db);
    const profile = repo.getRiskProtectiveProfile(studentId);
    
    res.json(profile || {});
  } catch (error) {
    console.error('Error fetching risk/protective profile:', error);
    res.status(500).json({ error: 'Failed to fetch risk/protective profile' });
  }
});

export default router;
