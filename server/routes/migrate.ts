import { RequestHandler } from "express";
import { z } from "zod";
import { migrateFromLocalStorage, getMigrationStatus } from "../lib/migrate.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/errors.js";

// Lenient validation schemas for migration data - accommodate real-world legacy data
const FrontendStudentSchema = z.object({
  id: z.string().min(1).max(50),
  ad: z.string().min(1).max(100),
  soyad: z.string().min(1).max(100),
  sinif: z.string().max(50), // Allow longer class names like "12/Fen-A"
  cinsiyet: z.enum(['K', 'E']),
  risk: z.enum(['Düşük', 'Orta', 'Yüksek']).optional(),
  telefon: z.string().max(50).optional(),
  eposta: z.string().max(200).optional(), // Allow non-email or empty strings
  adres: z.string().max(1000).optional(),
  veliAdi: z.string().max(200).optional(),
  veliTelefon: z.string().max(50).optional(),
  etiketler: z.array(z.string()).optional(),
  dogumTarihi: z.string().optional(),
  okulNo: z.string().max(50).optional(),
  il: z.string().max(100).optional(),
  ilce: z.string().max(100).optional(),
  rehberOgretmen: z.string().max(200).optional(),
  acilKisi: z.string().max(200).optional(),
  acilTelefon: z.string().max(50).optional(),
  ilgiAlanlari: z.array(z.string()).optional(),
  saglikNotu: z.string().max(1000).optional(),
  kanGrubu: z.string().max(10).optional()
}).passthrough(); // Allow additional unknown fields

const BackendStudentSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  email: z.string().max(200).optional(), // Allow non-email strings
  phone: z.string().max(50).optional(),
  birthDate: z.string().optional(),
  address: z.string().max(1000).optional(),
  className: z.string().max(50).optional(),
  enrollmentDate: z.string().optional(), // Make optional for legacy data
  status: z.enum(['active', 'inactive', 'graduated']).optional(),
  avatar: z.string().optional(),
  parentContact: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  gender: z.enum(['K', 'E']).optional()
}).passthrough(); // Allow additional unknown fields

const SubjectSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  code: z.string().max(10).optional(),
  description: z.string().max(500).optional(),
  color: z.string().max(7).optional()
});

const TopicSchema = z.object({
  id: z.string().min(1).max(50),
  subjectId: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  difficulty: z.string().max(20).optional(),
  estimatedHours: z.number().int().min(0).max(100).optional()
});

// Accept both frontend and backend student formats during migration
const StudentUnionSchema = z.union([FrontendStudentSchema, BackendStudentSchema]);

const MigrationDataSchema = z.object({
  students: z.array(StudentUnionSchema).max(10000).optional(),
  subjects: z.array(SubjectSchema).max(1000).optional(),
  topics: z.array(TopicSchema).max(5000).optional(),
  progress: z.array(z.any()).max(50000).optional(),
  academicGoals: z.array(z.any()).max(10000).optional()
});

// POST /api/migrate - localStorage'dan SQLite'a veri aktar
export const migrateData: RequestHandler = (req, res) => {
  try {
    // Basic checks for request body existence
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: "Geçersiz istek formatı. JSON verisi bekleniyor." 
      });
    }

    // Validate data structure with lenient schema
    const validationResult = MigrationDataSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.error('Migration validation error:', validationResult.error.issues);
      return res.status(400).json({
        success: false,
        error: "Veri formatında sorun var. Lütfen verilerinizi kontrol edin."
      });
    }

    const localStorageData = validationResult.data;
    const result = migrateFromLocalStorage(localStorageData);
    
    if (result.success) {
      res.json({ success: true, message: SUCCESS_MESSAGES.MIGRATION_COMPLETED });
    } else {
      res.status(500).json({ success: false, error: result.message });
    }
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ success: false, error: `${ERROR_MESSAGES.MIGRATION_FAILED}: ${error instanceof Error ? error.message : String(error)}` });
  }
};

// GET /api/migrate/status - Migration durumunu kontrol et
export const getMigrationStatusHandler: RequestHandler = (req, res) => {
  try {
    const status = getMigrationStatus();
    res.json(status);
  } catch (error) {
    console.error('Error checking migration status:', error);
    res.status(500).json({ success: false, error: ERROR_MESSAGES.FAILED_TO_CHECK_MIGRATION_STATUS });
  }
};