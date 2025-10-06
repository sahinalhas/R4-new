import type Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

export const migration009 = {
  version: 9,
  name: 'add_default_users',
  up: (db: Database.Database) => {
    const checkTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    
    if (!checkTable) {
      console.log('Users table does not exist yet, skipping default users migration');
      return;
    }

    const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    
    if (usersCount.count > 0) {
      console.log('Users already exist, skipping default users migration');
      return;
    }

    const defaultPassword = 'demo';
    const passwordHash = bcrypt.hashSync(defaultPassword, 10);

    const defaultUsers = [
      {
        id: 'admin1',
        name: 'Sistem Yöneticisi',
        email: 'admin@okul.edu.tr',
        role: 'admin',
        institution: 'Rehber360 Test Okulu'
      },
      {
        id: 'counselor1',
        name: 'Rehber Öğretmen',
        email: 'rehber@okul.edu.tr',
        role: 'counselor',
        institution: 'Rehber360 Test Okulu'
      },
      {
        id: 'teacher1',
        name: 'Sınıf Öğretmeni',
        email: 'ogretmen@okul.edu.tr',
        role: 'teacher',
        institution: 'Rehber360 Test Okulu'
      },
      {
        id: 'observer1',
        name: 'Gözlemci',
        email: 'gozlemci@okul.edu.tr',
        role: 'observer',
        institution: 'Rehber360 Test Okulu'
      }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO users (id, name, email, passwordHash, role, institution, isActive)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    for (const user of defaultUsers) {
      insertStmt.run(user.id, user.name, user.email, passwordHash, user.role, user.institution);
    }

    console.log(`✅ Added ${defaultUsers.length} default users with password: ${defaultPassword}`);
  }
};
