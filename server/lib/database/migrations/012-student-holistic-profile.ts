import type Database from 'better-sqlite3';

export const migration012 = {
  version: 12,
  name: 'student_holistic_profile',
  up: (db: Database.Database) => {
    console.log('Creating student holistic profile tables...');

    // 1. Güçlü Yönler & Kaynaklar
    db.exec(`
      CREATE TABLE IF NOT EXISTS student_strengths (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        assessmentDate TEXT NOT NULL,
        personalStrengths TEXT,
        academicStrengths TEXT,
        socialStrengths TEXT,
        creativeStrengths TEXT,
        physicalStrengths TEXT,
        successStories TEXT,
        resilienceFactors TEXT,
        supportSystems TEXT,
        copingStrategies TEXT,
        achievements TEXT,
        skills TEXT,
        talents TEXT,
        positiveFeedback TEXT,
        growthMindsetIndicators TEXT,
        notes TEXT,
        assessedBy TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
      );
    `);

    // 2. Sosyal İlişkiler & Akran Etkileşimi
    db.exec(`
      CREATE TABLE IF NOT EXISTS student_social_relations (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        assessmentDate TEXT NOT NULL,
        friendCircleSize TEXT CHECK (friendCircleSize IN ('YOK', 'AZ', 'ORTA', 'GENİŞ')),
        friendCircleQuality TEXT CHECK (friendCircleQuality IN ('ZAYIF', 'ORTA', 'İYİ', 'ÇOK_İYİ')),
        socialRole TEXT CHECK (socialRole IN ('LİDER', 'AKTİF_ÜYE', 'TAKİPÇİ', 'GÖZLEMCİ', 'İZOLE')),
        peerRelationshipQuality TEXT CHECK (peerRelationshipQuality IN ('SORUNLU', 'ZAYIF', 'ORTA', 'İYİ', 'ÇOK_İYİ')),
        socialSkillsLevel TEXT CHECK (socialSkillsLevel IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        conflictResolutionSkills TEXT CHECK (conflictResolutionSkills IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        leadershipQualities TEXT,
        teamworkAbility TEXT CHECK (teamworkAbility IN ('SORUNLU', 'ZAYIF', 'ORTA', 'İYİ', 'ÇOK_İYİ')),
        bullyingStatus TEXT CHECK (bullyingStatus IN ('YOK', 'MAĞDUR', 'FAİL', 'HER_İKİSİ', 'GÖZLEMCİ')),
        bullyingDetails TEXT,
        socialGroupDynamics TEXT,
        peerInfluence TEXT CHECK (peerInfluence IN ('OLUMSUZ', 'NÖTR', 'OLUMLU', 'ÇOK_OLUMLU')),
        inclusionStatus TEXT CHECK (inclusionStatus IN ('DIŞLANMIŞ', 'KISITLI', 'KABUL_EDİLMİŞ', 'POPÜLER')),
        communicationStyle TEXT,
        socialAnxietyLevel TEXT CHECK (socialAnxietyLevel IN ('YOK', 'DÜŞÜK', 'ORTA', 'YÜKSEK')),
        extracurricularSocialActivities TEXT,
        notes TEXT,
        assessedBy TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
      );
    `);

    // 3. İlgi Alanları & Yetenekler
    db.exec(`
      CREATE TABLE IF NOT EXISTS student_interests (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        assessmentDate TEXT NOT NULL,
        hobbies TEXT,
        passions TEXT,
        favoriteSubjects TEXT,
        leastFavoriteSubjects TEXT,
        specialTalents TEXT,
        creativeExpressionForms TEXT,
        sportsActivities TEXT,
        artisticActivities TEXT,
        musicInterests TEXT,
        technologicalInterests TEXT,
        readingHabits TEXT,
        favoriteBooks TEXT,
        favoriteMoviesShows TEXT,
        curiosityAreas TEXT,
        explorativeTopics TEXT,
        careerInterests TEXT,
        clubMemberships TEXT,
        volunteerWork TEXT,
        partTimeJobs TEXT,
        projectsUndertaken TEXT,
        skillsDevelopment TEXT,
        learningPreferences TEXT,
        motivationalTopics TEXT,
        notes TEXT,
        assessedBy TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
      );
    `);

    // 4. Gelecek Vizyonu & Motivasyon
    db.exec(`
      CREATE TABLE IF NOT EXISTS student_future_vision (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        assessmentDate TEXT NOT NULL,
        shortTermGoals TEXT,
        longTermGoals TEXT,
        careerAspirations TEXT,
        dreamJob TEXT,
        educationalGoals TEXT,
        universityPreferences TEXT,
        majorPreferences TEXT,
        lifeGoals TEXT,
        personalDreams TEXT,
        fearsAndConcerns TEXT,
        perceivedBarriers TEXT,
        motivationSources TEXT,
        motivationLevel TEXT CHECK (motivationLevel IN ('ÇOK_DÜŞÜK', 'DÜŞÜK', 'ORTA', 'YÜKSEK', 'ÇOK_YÜKSEK')),
        selfEfficacyLevel TEXT CHECK (selfEfficacyLevel IN ('ÇOK_DÜŞÜK', 'DÜŞÜK', 'ORTA', 'YÜKSEK', 'ÇOK_YÜKSEK')),
        growthMindset TEXT CHECK (growthMindset IN ('SABİT', 'KARIŞIK', 'GELİŞİM_ODAKLI')),
        futureOrientation TEXT CHECK (futureOrientation IN ('YOK', 'BELIRSIZ', 'NET', 'ÇOK_NET')),
        roleModels TEXT,
        inspirationSources TEXT,
        valuesAndPriorities TEXT,
        planningAbility TEXT CHECK (planningAbility IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        timeManagementSkills TEXT CHECK (timeManagementSkills IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        decisionMakingStyle TEXT,
        riskTakingTendency TEXT CHECK (riskTakingTendency IN ('ÇOK_DÜŞÜK', 'DÜŞÜK', 'ORTA', 'YÜKSEK', 'ÇOK_YÜKSEK')),
        actionSteps TEXT,
        progressTracking TEXT,
        notes TEXT,
        assessedBy TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
      );
    `);

    // 5. Sosyal-Duygusal Yeterlikler (SEL)
    db.exec(`
      CREATE TABLE IF NOT EXISTS student_sel_competencies (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        assessmentDate TEXT NOT NULL,
        selfAwarenessLevel TEXT CHECK (selfAwarenessLevel IN ('ÇOK_DÜŞÜK', 'DÜŞÜK', 'ORTA', 'YÜKSEK', 'ÇOK_YÜKSEK')),
        emotionRecognition TEXT CHECK (emotionRecognition IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        emotionExpression TEXT CHECK (emotionExpression IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        emotionRegulation TEXT CHECK (emotionRegulation IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        empathyLevel TEXT CHECK (empathyLevel IN ('ÇOK_DÜŞÜK', 'DÜŞÜK', 'ORTA', 'YÜKSEK', 'ÇOK_YÜKSEK')),
        socialAwareness TEXT CHECK (socialAwareness IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        perspectiveTaking TEXT CHECK (perspectiveTaking IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        relationshipSkills TEXT CHECK (relationshipSkills IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        cooperationSkills TEXT CHECK (cooperationSkills IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        communicationSkills TEXT CHECK (communicationSkills IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        conflictManagement TEXT CHECK (conflictManagement IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        problemSolvingApproach TEXT,
        problemSolvingSkills TEXT CHECK (problemSolvingSkills IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        decisionMakingSkills TEXT CHECK (decisionMakingSkills IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        responsibleDecisionMaking TEXT CHECK (responsibleDecisionMaking IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        selfManagement TEXT CHECK (selfManagement IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        impulseControl TEXT CHECK (impulseControl IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        stressCoping TEXT CHECK (stressCoping IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        stressManagementStrategies TEXT,
        resilienceLevel TEXT CHECK (resilienceLevel IN ('ÇOK_DÜŞÜK', 'DÜŞÜK', 'ORTA', 'YÜKSEK', 'ÇOK_YÜKSEK')),
        adaptability TEXT CHECK (adaptability IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        goalSetting TEXT CHECK (goalSetting IN ('ZAYIF', 'GELİŞMEKTE', 'YETERLİ', 'İYİ', 'İLERİ')),
        selfMotivation TEXT CHECK (selfMotivation IN ('ÇOK_DÜŞÜK', 'DÜŞÜK', 'ORTA', 'YÜKSEK', 'ÇOK_YÜKSEK')),
        optimismLevel TEXT CHECK (optimismLevel IN ('ÇOK_DÜŞÜK', 'DÜŞÜK', 'ORTA', 'YÜKSEK', 'ÇOK_YÜKSEK')),
        mindfulnessEngagement TEXT CHECK (mindfulnessEngagement IN ('YOK', 'NADİREN', 'BAZEN', 'SIKLIKLA', 'DÜZENLI')),
        notes TEXT,
        assessedBy TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
      );
    `);

    // 6. Sosyoekonomik Faktörler
    db.exec(`
      CREATE TABLE IF NOT EXISTS student_socioeconomic (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        assessmentDate TEXT NOT NULL,
        familyIncomeLevel TEXT CHECK (familyIncomeLevel IN ('ÇOK_DÜŞÜK', 'DÜŞÜK', 'ORTA', 'İYİ', 'YÜKSEK')),
        parentEmploymentStatus TEXT,
        motherEducationLevel TEXT CHECK (motherEducationLevel IN ('İLKOKUL', 'ORTAOKUL', 'LİSE', 'ÖNLİSANS', 'LİSANS', 'YÜKSEK_LİSANS', 'DOKTORA', 'BELİRTİLMEMİŞ')),
        fatherEducationLevel TEXT CHECK (fatherEducationLevel IN ('İLKOKUL', 'ORTAOKUL', 'LİSE', 'ÖNLİSANS', 'LİSANS', 'YÜKSEK_LİSANS', 'DOKTORA', 'BELİRTİLMEMİŞ')),
        householdSize INTEGER,
        numberOfSiblings INTEGER,
        birthOrder TEXT,
        housingType TEXT CHECK (housingType IN ('KİRA', 'MÜLK', 'LOJMAN', 'DİĞER')),
        housingCondition TEXT CHECK (housingCondition IN ('KÖTÜ', 'ORTA', 'İYİ', 'ÇOK_İYİ')),
        studySpaceAvailability TEXT CHECK (studySpaceAvailability IN ('YOK', 'PAYLAŞIMLI', 'KENDİ_ODASI', 'ÖZEL_ÇALIŞMA_ALANI')),
        internetAccess TEXT CHECK (internetAccess IN ('YOK', 'SINIRLI', 'YETERLİ', 'İYİ')),
        deviceAccess TEXT,
        schoolResourcesUsage TEXT,
        financialBarriers TEXT,
        resourcesAndSupports TEXT,
        scholarshipsOrAid TEXT,
        materialNeeds TEXT,
        nutritionStatus TEXT CHECK (nutritionStatus IN ('YETERSİZ', 'ORTA', 'YETERLİ', 'İYİ')),
        transportationToSchool TEXT CHECK (transportationToSchool IN ('YÜRÜME', 'TOPLU_TAŞIMA', 'OKUL_SERVİSİ', 'AİLE_ARACI', 'DİĞER')),
        extracurricularAccessibility TEXT CHECK (extracurricularAccessibility IN ('YOK', 'SINIRLI', 'ORTA', 'GENİŞ')),
        culturalCapital TEXT,
        socialCapital TEXT,
        communitySupport TEXT,
        economicStressors TEXT,
        familyFinancialStability TEXT CHECK (familyFinancialStability IN ('SORUNLU', 'İSTİKRARSIZ', 'KARIŞIK', 'İSTİKRARLI', 'GÜVENLİ')),
        workResponsibilities TEXT,
        caregivingResponsibilities TEXT,
        notes TEXT,
        confidentialityLevel TEXT CHECK (confidentialityLevel IN ('GENEL', 'SINIRLI', 'GİZLİ', 'ÇOK_GİZLİ')) DEFAULT 'GİZLİ',
        assessedBy TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
      );
    `);

    // Indexes for performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_student_strengths_student 
      ON student_strengths(studentId, assessmentDate DESC);
      
      CREATE INDEX IF NOT EXISTS idx_student_social_relations_student 
      ON student_social_relations(studentId, assessmentDate DESC);
      
      CREATE INDEX IF NOT EXISTS idx_student_interests_student 
      ON student_interests(studentId, assessmentDate DESC);
      
      CREATE INDEX IF NOT EXISTS idx_student_future_vision_student 
      ON student_future_vision(studentId, assessmentDate DESC);
      
      CREATE INDEX IF NOT EXISTS idx_student_sel_competencies_student 
      ON student_sel_competencies(studentId, assessmentDate DESC);
      
      CREATE INDEX IF NOT EXISTS idx_student_socioeconomic_student 
      ON student_socioeconomic(studentId, assessmentDate DESC);
    `);

    console.log('Student holistic profile tables created successfully');
  }
};
