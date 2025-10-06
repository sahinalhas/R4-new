import Database from 'better-sqlite3';

const db = new Database('data.db');

console.log('=== Testing Direct Database Insert ===\n');

// Create a test counseling session directly
const testSession = {
  id: 'test_session_' + Date.now(),
  sessionType: 'individual',
  groupName: null,
  counselorId: 'test_counselor',
  sessionDate: '2024-10-06',
  entryTime: '10:00',
  entryClassHourId: 1,
  topic: 'Test Görüşme',
  participantType: 'öğrenci',
  relationshipType: null,
  otherParticipants: null,
  parentName: null,
  parentRelationship: null,
  teacherName: null,
  teacherBranch: null,
  otherParticipantDescription: null,
  sessionMode: 'yüz_yüze',
  sessionLocation: 'Rehberlik Odası',
  disciplineStatus: null,
  institutionalCooperation: null,
  sessionDetails: 'Test detayları',
  completed: 0
};

try {
  const insertStmt = db.prepare(`
    INSERT INTO counseling_sessions (
      id, sessionType, groupName, counselorId, sessionDate, entryTime, entryClassHourId,
      topic, participantType, relationshipType, otherParticipants, parentName,
      parentRelationship, teacherName, teacherBranch, otherParticipantDescription,
      sessionMode, sessionLocation, disciplineStatus, institutionalCooperation,
      sessionDetails, completed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insertStmt.run(
    testSession.id,
    testSession.sessionType,
    testSession.groupName,
    testSession.counselorId,
    testSession.sessionDate,
    testSession.entryTime,
    testSession.entryClassHourId,
    testSession.topic,
    testSession.participantType,
    testSession.relationshipType,
    testSession.otherParticipants,
    testSession.parentName,
    testSession.parentRelationship,
    testSession.teacherName,
    testSession.teacherBranch,
    testSession.otherParticipantDescription,
    testSession.sessionMode,
    testSession.sessionLocation,
    testSession.disciplineStatus,
    testSession.institutionalCooperation,
    testSession.sessionDetails,
    testSession.completed
  );

  console.log('✅ Session inserted successfully!');
  console.log('Changes:', result.changes);
  console.log('Last insert ID:', result.lastInsertRowid);
  
  // Verify the insert
  const verify = db.prepare('SELECT * FROM counseling_sessions WHERE id = ?').get(testSession.id);
  console.log('\n=== Verification ===');
  console.log('Session found:', verify ? 'YES' : 'NO');
  if (verify) {
    console.log('Session data:', JSON.stringify(verify, null, 2));
  }
  
  // Check total count
  const count = db.prepare('SELECT COUNT(*) as count FROM counseling_sessions').get();
  console.log('\nTotal sessions in DB:', count.count);
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}
