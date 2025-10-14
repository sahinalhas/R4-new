/**
 * Session Form Auto-Fill Service
 * Sesli not transkriptini akıllıca analiz edip tüm görüşme formunu otomatik doldurur
 */

import { AIProviderService } from './ai-provider.service.js';

export interface SessionFormAutoFillResult {
  exitTime?: string;
  sessionFlow?: 'çok_olumlu' | 'olumlu' | 'nötr' | 'sorunlu' | 'kriz';
  detailedNotes: string;
  achievedOutcomes?: string;
  studentParticipationLevel?: 'çok_aktif' | 'aktif' | 'pasif' | 'dirençli' | 'kapalı';
  cooperationLevel?: number;
  emotionalState?: 'sakin' | 'kaygılı' | 'üzgün' | 'sinirli' | 'mutlu' | 'karışık' | 'diğer';
  physicalState?: 'normal' | 'yorgun' | 'huzursuz' | 'ajite';
  communicationQuality?: 'açık' | 'ketum' | 'seçici' | 'kapalı';
  sessionTags?: string[];
  actionItems?: Array<{
    id: string;
    description: string;
    assignedTo?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
  }>;
  followUpNeeded?: boolean;
  followUpPlan?: string;
}

export class SessionFormAutoFillService {
  private aiProvider: AIProviderService;

  constructor() {
    this.aiProvider = AIProviderService.getInstance();
  }

  /**
   * Sesli not transkriptini alıp tüm görüşme formunu otomatik doldur
   */
  async autoFillForm(transcriptionText: string, sessionType?: string): Promise<SessionFormAutoFillResult> {
    const prompt = `
Sen profesyonel bir rehber öğretmensin. Aşağıda bir görüşme sırasında alınan sesli notun transkripti var.
Bu transkripti dikkatlice analiz et ve görüşme tamamlama formunu OTOMATIK olarak doldur.

TRANSKRİPT:
"${transcriptionText}"

${sessionType ? `GÖRÜŞME TİPİ: ${sessionType}` : ''}

Aşağıdaki alanları doldur ve JSON formatında döndür:

1. **sessionFlow**: Görüşmenin genel seyri
   - "çok_olumlu": Çok başarılı, pozitif, etkili bir görüşme
   - "olumlu": Genel olarak iyi geçti
   - "nötr": Ne özellikle iyi ne kötü
   - "sorunlu": Zorluklar, dirençler yaşandı
   - "kriz": Acil müdahale gerektiren durum

2. **detailedNotes**: Görüşmenin detaylı özeti (tam metinden çıkar, mantıklı paragraflar halinde yaz)

3. **achievedOutcomes**: Görüşmede ulaşılan sonuçlar ve alınan kararlar

4. **studentParticipationLevel**: Öğrencinin katılım düzeyi
   - "çok_aktif": Çok aktif katılım, soruları cevaplıyor, kendisi konuşuyor
   - "aktif": İyi katılım
   - "pasif": Az konuşuyor, soru sorulunca cevaplıyor
   - "dirençli": Direnç gösteriyor, konuşmak istemiyor
   - "kapalı": Hiç konuşmuyor veya çok minimal

5. **cooperationLevel**: İşbirliği düzeyi (1-5 arası sayı)
   - 1: Hiç işbirliği yok
   - 3: Orta düzey
   - 5: Tam işbirliği

6. **emotionalState**: Öğrencinin duygu durumu
   - "sakin", "kaygılı", "üzgün", "sinirli", "mutlu", "karışık", "diğer"

7. **physicalState**: Fiziksel gözlemler
   - "normal", "yorgun", "huzursuz", "ajite"

8. **communicationQuality**: İletişim kalitesi
   - "açık": Açık ve net iletişim
   - "ketum": Çok konuşmuyor ama konuşuyor
   - "seçici": Bazı konularda konuşuyor bazılarında değil
   - "kapalı": İletişim kurulmuyor

9. **sessionTags**: Görüşme etiketleri (array, en fazla 5 etiket)
   - Akademik konular için: "ders_başarısı", "sınav_kaygısı", "ödev_sorunları", "okul_motivasyonu"
   - Sosyal-duygusal için: "arkadaş_ilişkileri", "özgüven", "kaygı", "stres", "aile_sorunları"
   - Davranışsal için: "dikkat_eksikliği", "sınıf_davranışı", "kurallar"
   - Kariyer için: "meslek_seçimi", "üniversite_tercihi"
   - Diğer: "veli_görüşmesi", "kriz_müdahale", "yönlendirme"

10. **actionItems**: Yapılacak aksiyonlar (array of objects)
    - Her aksiyon için: description (aksiyon açıklaması), priority ("low", "medium", "high")
    - assignedTo ve dueDate opsiyonel (eğer transkriptte varsa ekle)
    - Görüşmeden çıkan somut adımları belirt

11. **followUpNeeded**: Takip görüşmesi gerekli mi? (true/false)

12. **followUpPlan**: Eğer takip gerekiyorsa, takip planı (string)

ÖNEMLI:
- Transkriptteki bilgileri kullan, ekleme yapma
- Eğer bir bilgi transkriptte yoksa, o alanı boş bırak (undefined/null)
- detailedNotes'u profesyonel ve yapılandırılmış yaz
- Mantıklı çıkarımlar yap (örn: "çok üzgün" diyorsa emotionalState: "üzgün")
- Aksiyon itemları SMART olsun (Specific, Measurable, Achievable, Relevant, Time-bound)

JSON formatı:
{
  "sessionFlow": "...",
  "detailedNotes": "...",
  "achievedOutcomes": "...",
  "studentParticipationLevel": "...",
  "cooperationLevel": 3,
  "emotionalState": "...",
  "physicalState": "...",
  "communicationQuality": "...",
  "sessionTags": ["tag1", "tag2"],
  "actionItems": [
    {
      "id": "unique-id-1",
      "description": "Aksiyon açıklaması",
      "assignedTo": "Opsiyonel - kime atandı",
      "dueDate": "Opsiyonel - YYYY-MM-DD formatında",
      "priority": "medium"
    }
  ],
  "followUpNeeded": false,
  "followUpPlan": "..."
}
`;

    try {
      const response = await this.aiProvider.chat({
        messages: [
          {
            role: 'system',
            content: 'Sen uzman bir rehber öğretmensin. Görüşme notlarını analiz edip formları otomatik dolduruyorsun. Her zaman JSON formatında yapılandırılmış veri döndürürsün.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        format: 'json'
      });

      const result = JSON.parse(response) as SessionFormAutoFillResult;

      // Validasyon
      if (!result.detailedNotes) {
        throw new Error('AI analizi detailedNotes döndürmedi');
      }

      // actionItems için ID oluştur (eğer yoksa)
      if (result.actionItems && Array.isArray(result.actionItems)) {
        result.actionItems = result.actionItems.map((item, index) => ({
          ...item,
          id: item.id || `action-${Date.now()}-${index}`
        }));
      }

      return result;
    } catch (error: any) {
      console.error('Form auto-fill hatası:', error);
      
      // Fallback: En azından transkripti detailedNotes olarak döndür
      return {
        detailedNotes: `[Otomatik Form Doldurma Başarısız]\n\nTRANSKRİPT:\n${transcriptionText}\n\nHata: ${error.message}`,
        sessionFlow: 'nötr',
        cooperationLevel: 3
      };
    }
  }

  /**
   * Birden fazla sesli notu birleştirip form doldur
   */
  async autoFillFromMultipleNotes(transcriptions: string[], sessionType?: string): Promise<SessionFormAutoFillResult> {
    const combinedTranscript = transcriptions
      .map((text, index) => `[Not ${index + 1}]\n${text}`)
      .join('\n\n---\n\n');

    return this.autoFillForm(combinedTranscript, sessionType);
  }
}
