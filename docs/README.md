# Rehber360

Eğitim kurumları için kapsamlı öğrenci rehberlik ve yönetim sistemi.

## 📋 Genel Bakış

Rehber360, eğitim kurumlarında öğrenci takibi, rehberlik ve idari görevler için modern ve verimli bir platform sunar. Otomatik müdahale sistemi, akıllı konu planlama ve detaylı öğrenci profilleri ile öğrenci desteğini ve yönetim verimliliğini artırmayı hedefler.

## ✨ Temel Özellikler

- **Öğrenci Profilleri**: Kapsamlı, standartlaştırılmış öğrenci profil sistemi
- **Risk Değerlendirmesi**: Otomatik risk analizi ve koruyucu faktör takibi
- **Müdahale Sistemi**: Standartlaştırılmış müdahale takibi ve takvim entegrasyonu
- **Davranış Takibi**: ABC modeline dayalı davranış olayı kayıtları
- **Akıllı Planlama**: Haftalık ders çizelgesi ve konu bazlı planlama
- **Performans Analitiği**: Sunucu taraflı analitik ve önbellekleme

## 🛠️ Teknoloji Stack

### Frontend
- **React 18** + TypeScript
- **Vite** - Build tool
- **Radix UI** - Unstyled component library
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animasyon kütüphanesi
- **React Hook Form** + **Zod** - Form yönetimi ve validasyon

### Backend
- **Express.js** - Web framework
- **SQLite** - Veritabanı (`database.db`)
- **Better-SQLite3** - Database driver

### Proje Yapısı
```
.
├── client/          # Frontend kodları
├── server/          # Backend kodları
│   ├── features/    # Feature-based modüller
│   ├── lib/         # Database, middleware
│   └── services/    # İş mantığı servisleri
├── shared/          # Ortak tipler ve sabitler
├── database.db      # SQLite veritabanı (kök dizinde)
└── docs/            # Dokümantasyon
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 20+
- PNPM 10+

### Geliştirme Modu
```bash
# Bağımlılıkları yükle
pnpm install

# Geliştirme sunucusunu başlat
pnpm dev
```

### Production Build
```bash
# Build al
pnpm build

# Production sunucuyu başlat
pnpm start
```

## 📚 Dokümantasyon

- [Deployment Kılavuzu](docs/DEPLOYMENT.md)
- [Takvim Sistemi Detayları](docs/takvim.txt)
- [Proje Yapısı](replit.md)

## 🎨 Tasarım Özellikleri

- **Modern Renk Paleti**: Sofistike mor tonları (HSL 262 80% 45%)
- **Glass Morphism**: Backdrop-blur efektleri ve katmanlı gölgeler
- **Premium Typography**: Inter font ile optimize edilmiş okunabilirlik
- **Smooth Animations**: GPU optimize geçişler
- **Responsive Design**: Altın oran tabanlı boşluklar

## 📊 Veritabanı

SQLite veritabanı proje kök dizininde tutulur:
- `database.db` - Ana veritabanı
- `database.db-shm` - Shared memory dosyası
- `database.db-wal` - Write-Ahead Log

## 🔧 Geliştirme Komutları

```bash
# Lint kontrolü
pnpm lint

# Lint otomatik düzelt
pnpm lint:fix

# Format kontrolü
pnpm format

# Format düzelt
pnpm format:fix

# Type kontrolü
pnpm typecheck

# Tüm kalite kontrolleri
pnpm quality

# Test çalıştır
pnpm test
```

## 📝 Lisans

Bu proje özel kullanım içindir.

---

**Geliştirici Notu**: Replit autoscale deployment için yapılandırılmıştır.
