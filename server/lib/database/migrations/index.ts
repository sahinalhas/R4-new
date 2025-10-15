import type Database from 'better-sqlite3';
import { migration001 } from './001-add-gender-column';
import { migration002 } from './002-add-category-column';
import { migration003 } from './003-migrate-user-sessions';
import { migration004 } from './004-fix-interventions-schema';
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
import { migration016 } from './016-add-missing-coaching-columns';
import { migration017 } from './017-daily-insights';
import { up as migration018up, down as migration018down } from './018-notification-automation';
import { migration019 } from './019-enhanced-session-completion';
import { migration as migration020 } from './020-social-network-analysis';
import { migration021 } from './021-fix-missing-features';
import { migration022 } from './022-daily-action-plans';
import { migration023 } from './023-add-province-district-columns';
import { up as migration024up, down as migration024down } from './024-update-motivation-profile-fields';
import { migration025 } from './025-add-family-context-profiles';

const migration018 = {
  version: 18,
  name: 'notification-automation',
  up: migration018up,
  down: migration018down
};

const migration024 = {
  version: 24,
  name: 'update-motivation-profile-fields',
  up: migration024up,
  down: migration024down
};

const migrations = [
  migration001,
  migration002,
  migration003,
  migration004,
  migration006,
  migration007,
  migration008,
  migration009,
  migration010,
  migration011,
  migration012,
  migration013,
  migration014,
  migration015,
  migration016,
  migration017,
  migration018,
  migration019,
  migration020,
  migration021,
  migration022,
  migration023,
  migration024
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
