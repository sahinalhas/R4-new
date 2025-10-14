/**
 * Conflict Resolution Routes
 * Çelişki çözümleme - Manuel karar verme
 */

import { Request, Response } from 'express';
import * as repository from '../repository/profile-sync.repository.js';
import { getDatabase } from '../../../lib/db-service.js';

interface ManualResolutionRequest {
  conflictId: string;
  selectedValue: any;
  reason: string;
  resolvedBy: string;
}

export function resolveConflictManually(req: Request, res: Response) {
  try {
    const resolution: ManualResolutionRequest = req.body;
    
    if (!resolution.conflictId || !resolution.selectedValue) {
      return res.status(400).json({ 
        success: false, 
        error: 'conflictId ve selectedValue gerekli' 
      });
    }

    const db = getDatabase();
    
    // Çelişki kaydını güncelle
    const updateStmt = db.prepare(`
      UPDATE conflict_resolutions
      SET resolvedValue = ?, 
          resolutionMethod = 'manual',
          reasoning = ?,
          resolvedBy = ?,
          timestamp = ?
      WHERE id = ?
    `);
    
    updateStmt.run(
      JSON.stringify(resolution.selectedValue),
      resolution.reason,
      resolution.resolvedBy,
      new Date().toISOString(),
      resolution.conflictId
    );

    // Çelişkiyi getir ve profile'ı güncelle
    const conflict = repository.getConflictById(resolution.conflictId);
    
    if (conflict && conflict.domain) {
      // Seçilen değeri profile'a uygula
      applyResolvedValue(
        conflict.studentId,
        conflict.domain,
        resolution.selectedValue
      );
    }

    res.json({ 
      success: true, 
      message: 'Çelişki manuel olarak çözüldü' 
    });
  } catch (error) {
    console.error('Error resolving conflict:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Çelişki çözümlenemedi' 
    });
  }
}

export function getPendingConflicts(req: Request, res: Response) {
  try {
    const { studentId } = req.query;
    
    const db = getDatabase();
    let stmt;
    let params: any[];
    
    if (studentId) {
      stmt = db.prepare(`
        SELECT * FROM conflict_resolutions
        WHERE studentId = ? AND resolutionMethod = 'pending'
        ORDER BY timestamp DESC
      `);
      params = [studentId];
    } else {
      stmt = db.prepare(`
        SELECT * FROM conflict_resolutions
        WHERE resolutionMethod = 'pending'
        ORDER BY severity DESC, timestamp DESC
        LIMIT 50
      `);
      params = [];
    }
    
    const rows = stmt.all(...params) as any[];
    const conflicts = rows.map(row => ({
      id: row.id,
      studentId: row.studentId,
      conflictType: row.conflictType,
      domain: row.domain,
      oldValue: JSON.parse(row.oldValue),
      newValue: JSON.parse(row.newValue),
      severity: row.severity,
      reasoning: row.reasoning,
      timestamp: row.timestamp
    }));
    
    res.json(conflicts);
  } catch (error) {
    console.error('Error fetching pending conflicts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Bekleyen çelişkiler yüklenemedi' 
    });
  }
}

export function bulkResolveConflicts(req: Request, res: Response) {
  try {
    const { resolutions, resolvedBy } = req.body;
    
    if (!resolutions || !Array.isArray(resolutions)) {
      return res.status(400).json({ 
        success: false, 
        error: 'resolutions array gerekli' 
      });
    }

    const db = getDatabase();
    const results: any[] = [];
    
    for (const resolution of resolutions) {
      try {
        const updateStmt = db.prepare(`
          UPDATE conflict_resolutions
          SET resolvedValue = ?, 
              resolutionMethod = 'manual_bulk',
              reasoning = ?,
              resolvedBy = ?,
              timestamp = ?
          WHERE id = ?
        `);
        
        updateStmt.run(
          JSON.stringify(resolution.selectedValue),
          resolution.reason || 'Toplu çözüm',
          resolvedBy,
          new Date().toISOString(),
          resolution.conflictId
        );
        
        results.push({ 
          conflictId: resolution.conflictId, 
          success: true 
        });
      } catch (error) {
        results.push({ 
          conflictId: resolution.conflictId, 
          success: false, 
          error: String(error) 
        });
      }
    }

    res.json({ 
      success: true, 
      message: `${results.filter(r => r.success).length} çelişki çözüldü`,
      results 
    });
  } catch (error) {
    console.error('Error in bulk conflict resolution:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Toplu çözümleme başarısız' 
    });
  }
}

function applyResolvedValue(
  studentId: string,
  domain: string,
  value: any
): void {
  const db = getDatabase();
  
  const tableMap: Record<string, string> = {
    'health': 'health_profile',
    'academic': 'academic_profile', 
    'social_emotional': 'social_emotional_profile',
    'talents_interests': 'talents_interests_profile'
  };
  
  const tableName = tableMap[domain];
  if (!tableName) return;
  
  try {
    // value objesi içindeki her alanı güncelle
    if (typeof value === 'object' && value !== null) {
      for (const [field, fieldValue] of Object.entries(value)) {
        const stmt = db.prepare(`
          UPDATE ${tableName}
          SET ${field} = ?, updatedAt = ?
          WHERE studentId = ?
        `);
        
        stmt.run(
          typeof fieldValue === 'object' ? JSON.stringify(fieldValue) : fieldValue,
          new Date().toISOString(),
          studentId
        );
      }
    }
  } catch (error) {
    console.error(`Error applying resolved value to ${domain}:`, error);
  }
}
