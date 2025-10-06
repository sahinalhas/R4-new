import Database from 'better-sqlite3';

const db = new Database('data.db');

console.log('=== Initializing App Settings ===\n');

const defaultSettings = {
  school: {
    name: "Örnek Okul",
    address: "",
    phone: "",
    email: "",
    logo: "",
    periods: [
      { start: "08:30", end: "09:20" },
      { start: "09:30", end: "10:20" },
      { start: "10:30", end: "11:20" },
      { start: "11:30", end: "12:20" },
      { start: "13:00", end: "13:50" },
      { start: "14:00", end: "14:50" },
      { start: "15:00", end: "15:50" },
      { start: "16:00", end: "16:50" }
    ]
  },
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  data: {
    backupFrequency: "daily",
    retentionDays: 90
  },
  integrations: {
    zoom: { enabled: false },
    calendar: { enabled: false }
  },
  privacy: {
    shareAnalytics: false,
    dataMasking: true
  },
  account: {
    language: "tr",
    timezone: "Europe/Istanbul"
  },
  presentationSystem: [
    {
      id: "akademik",
      title: "Akademik Rehberlik",
      icon: "GraduationCap",
      color: "#3b82f6",
      categories: [
        {
          id: "ders-basvuru",
          title: "Ders Başarısı",
          items: [
            { id: "ders-basarisi-1", title: "Ders çalışma alışkanlıkları" },
            { id: "ders-basarisi-2", title: "Sınav kaygısı" },
            { id: "ders-basarisi-3", title: "Not ortalaması düşük" }
          ]
        },
        {
          id: "mesleki-yonlendirme",
          title: "Mesleki Yönlendirme",
          items: [
            { id: "meslek-1", title: "Meslek seçimi" },
            { id: "meslek-2", title: "Üniversite tercihi" },
            { id: "meslek-3", title: "Bölüm tanıtımı" }
          ]
        }
      ]
    },
    {
      id: "kisisel-sosyal",
      title: "Kişisel-Sosyal Rehberlik",
      icon: "Heart",
      color: "#ec4899",
      categories: [
        {
          id: "duygusal-sorunlar",
          title: "Duygusal Sorunlar",
          items: [
            { id: "duygu-1", title: "Kaygı ve stres" },
            { id: "duygu-2", title: "Üzüntü ve depresif duygu durumu" },
            { id: "duygu-3", title: "Öfke kontrolü" }
          ]
        },
        {
          id: "sosyal-iliskiler",
          title: "Sosyal İlişkiler",
          items: [
            { id: "sosyal-1", title: "Arkadaşlık ilişkileri" },
            { id: "sosyal-2", title: "İletişim sorunları" },
            { id: "sosyal-3", title: "Zorbalık" }
          ]
        }
      ]
    }
  ]
};

try {
  const upsertStmt = db.prepare(`
    INSERT INTO app_settings (id, settings)
    VALUES (1, ?)
    ON CONFLICT(id) DO UPDATE SET 
      settings = excluded.settings,
      updated_at = CURRENT_TIMESTAMP
  `);

  upsertStmt.run(JSON.stringify(defaultSettings));
  
  console.log('✅ Default settings inserted successfully!');
  
  // Verify
  const verify = db.prepare('SELECT * FROM app_settings WHERE id = 1').get();
  if (verify) {
    console.log('\n=== Verification ===');
    console.log('Settings row found: YES');
    console.log('School name:', JSON.parse(verify.settings).school.name);
    console.log('Class periods:', JSON.parse(verify.settings).school.periods.length);
    console.log('Presentation tabs:', JSON.parse(verify.settings).presentationSystem.length);
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}
