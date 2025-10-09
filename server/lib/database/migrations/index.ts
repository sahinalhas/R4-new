import type Database from 'better-sqlite3';
import { migration001 } from './001-add-gender-column';
import { migration002 } from './002-add-category-column';
import { migration003 } from './003-migrate-user-sessions';
import { migration004 } from './004-fix-interventions-schema';
import { migration005 } from './005-add-topic-fields';
import { migration006 } from './006-add-unique-constraint';
import { migration007 } from './007-add-topic-planning-fields';
import { migration008 } from './008-add-participant-fields';
import { migration009 } from './009-add-default-users';
import { migration010 } from './010-add-student-analytics-snapshot';
import { migration011 } from './011-early-warning-system';
import { migration012 } from './012-student-holistic-profile';
import { migration013 } from './013-fix-schema-columns';
import { migration014 } from './014-fix-additional-schema-columns';
import { migration015 } from './015-fix-remaining-columns';

const migrations = [
  migration001,
  migration002,
  migration003,
  migration004,
  migration005,
  migration006,
  migration007,
  migration008,
  migration009,
  migration010,
  migration011,
  migration012,
  migration013,
  migration014,
  migration015
];

export function runDatabaseMigrations(db: Database.Database): void {
  try {
    const getCurrentVersion = () => {
      try {
        const result = db.prepare('SELECT MAX(version) as version FROM schema_migrations').get() as { version: number | null };
        return result.version || 0;
      } catch {
        return 0;
      }
    };

    const currentVersion = getCurrentVersion();
    const recordMigration = db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)');

    for (const migration of migrations) {
      if (migration.version > currentVersion) {
        console.log(`Running migration ${migration.version}: ${migration.name}`);
        try {
          migration.up(db);
          recordMigration.run(migration.version, migration.name);
          console.log(`Migration ${migration.version} completed successfully`);
        } catch (migrationError) {
          console.error(`Migration ${migration.version} failed:`, migrationError);
          throw migrationError;
        }
      }
    }
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}
