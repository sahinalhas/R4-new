import type Database from 'better-sqlite3';

export const migration = {
  version: 20,
  name: 'social-network-analysis',
  up: (db: Database.Database) => {
    console.log('Creating social network analysis tables...');

    db.exec(`
      CREATE TABLE IF NOT EXISTS peer_relationships (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        peerId TEXT NOT NULL,
        relationshipType TEXT NOT NULL CHECK (relationshipType IN (
          'FRIEND',
          'CLOSE_FRIEND',
          'ACQUAINTANCE',
          'STUDY_PARTNER',
          'GROUP_MEMBER',
          'CONFLICT',
          'NEUTRAL'
        )),
        relationshipStrength INTEGER DEFAULT 5 CHECK (relationshipStrength BETWEEN 1 AND 10),
        bidirectional BOOLEAN DEFAULT FALSE,
        notes TEXT,
        assessedBy TEXT,
        assessmentDate TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (peerId) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE(studentId, peerId, relationshipType)
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS social_groups (
        id TEXT PRIMARY KEY,
        groupName TEXT NOT NULL,
        groupType TEXT NOT NULL CHECK (groupType IN (
          'FRIENDSHIP_CIRCLE',
          'STUDY_GROUP',
          'SPORTS_TEAM',
          'CLUB',
          'INFORMAL',
          'OTHER'
        )),
        className TEXT,
        description TEXT,
        leaderId TEXT,
        isActive BOOLEAN DEFAULT TRUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (leaderId) REFERENCES students(id) ON DELETE SET NULL
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS social_group_members (
        id TEXT PRIMARY KEY,
        groupId TEXT NOT NULL,
        studentId TEXT NOT NULL,
        role TEXT CHECK (role IN ('LEADER', 'ACTIVE_MEMBER', 'PASSIVE_MEMBER', 'OBSERVER')),
        joinDate TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (groupId) REFERENCES social_groups(id) ON DELETE CASCADE,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE(groupId, studentId)
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS social_network_metrics (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        className TEXT NOT NULL,
        assessmentDate TEXT NOT NULL,
        centralityScore REAL DEFAULT 0,
        betweennessScore REAL DEFAULT 0,
        closenessScore REAL DEFAULT 0,
        degreeCount INTEGER DEFAULT 0,
        clusteringCoefficient REAL DEFAULT 0,
        isolationRisk TEXT CHECK (isolationRisk IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
        socialRole TEXT CHECK (socialRole IN ('LEADER', 'BRIDGE', 'FOLLOWER', 'ISOLATE', 'PERIPHERAL')),
        influenceScore REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE(studentId, assessmentDate)
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS bullying_reports (
        id TEXT PRIMARY KEY,
        reportDate TEXT NOT NULL,
        reportedBy TEXT NOT NULL,
        victimId TEXT,
        perpetratorId TEXT,
        witnessList TEXT,
        incidentType TEXT NOT NULL CHECK (incidentType IN (
          'PHYSICAL',
          'VERBAL',
          'SOCIAL_EXCLUSION',
          'CYBER',
          'PSYCHOLOGICAL',
          'OTHER'
        )),
        severity TEXT NOT NULL CHECK (severity IN ('MILD', 'MODERATE', 'SEVERE', 'CRITICAL')),
        description TEXT NOT NULL,
        location TEXT,
        actionsTaken TEXT,
        status TEXT DEFAULT 'REPORTED' CHECK (status IN (
          'REPORTED',
          'INVESTIGATING',
          'RESOLVED',
          'ONGOING_MONITORING',
          'ESCALATED'
        )),
        followUpDate TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (victimId) REFERENCES students(id) ON DELETE SET NULL,
        FOREIGN KEY (perpetratorId) REFERENCES students(id) ON DELETE SET NULL
      );
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_peer_relationships_student ON peer_relationships(studentId);
      CREATE INDEX IF NOT EXISTS idx_peer_relationships_peer ON peer_relationships(peerId);
      CREATE INDEX IF NOT EXISTS idx_peer_relationships_type ON peer_relationships(relationshipType);
      CREATE INDEX IF NOT EXISTS idx_social_groups_class ON social_groups(className);
      CREATE INDEX IF NOT EXISTS idx_social_group_members_group ON social_group_members(groupId);
      CREATE INDEX IF NOT EXISTS idx_social_group_members_student ON social_group_members(studentId);
      CREATE INDEX IF NOT EXISTS idx_social_network_metrics_student ON social_network_metrics(studentId);
      CREATE INDEX IF NOT EXISTS idx_social_network_metrics_class ON social_network_metrics(className);
      CREATE INDEX IF NOT EXISTS idx_bullying_reports_victim ON bullying_reports(victimId);
      CREATE INDEX IF NOT EXISTS idx_bullying_reports_perpetrator ON bullying_reports(perpetratorId);
    `);

    console.log('Social network analysis tables created successfully');
  },

  down: (db: Database.Database) => {
    db.exec(`DROP TABLE IF EXISTS bullying_reports;`);
    db.exec(`DROP TABLE IF EXISTS social_network_metrics;`);
    db.exec(`DROP TABLE IF EXISTS social_group_members;`);
    db.exec(`DROP TABLE IF EXISTS social_groups;`);
    db.exec(`DROP TABLE IF EXISTS peer_relationships;`);
  }
};
