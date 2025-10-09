import {
  User,
  GraduationCap,
  Brain,
  MessageCircle,
  Heart,
  Activity,
  CalendarDays,
  BookOpen,
  Zap,
  TrendingUp,
  ShieldAlert,
  Target,
  Users,
  Trophy,
  PieChart,
  Star,
  FileText,
  AlertTriangle,
  ClipboardList,
  BarChart2,
  Briefcase,
  Sparkles,
  Database,
  Shield,
} from "lucide-react";

export const MAIN_TABS = [
  {
    value: "temel",
    label: "Temel Bilgiler",
    icon: User,
  },
  {
    value: "egitsel-rehberlik",
    label: "Eğitsel Rehberlik",
    icon: GraduationCap,
  },
  {
    value: "mesleki-rehberlik",
    label: "Mesleki Rehberlik",
    icon: Briefcase,
  },
  {
    value: "kisisel-psikososyal",
    label: "Kişisel/Psikososyal Rehberlik",
    icon: Brain,
  },
  {
    value: "aile-iletisimi",
    label: "Aile İletişimi",
    icon: Heart,
  },
  {
    value: "standartlastirilmis-profil",
    label: "Standartlaştırılmış Profil",
    icon: Database,
  },
] as const;

export const TEMEL_TABS = [
  {
    value: "ogrenci-bilgileri",
    label: "Öğrenci Bilgileri",
    icon: User,
  },
  {
    value: "saglik",
    label: "Sağlık Bilgileri",
    icon: Activity,
  },
] as const;

export const EGITSEL_TABS = [
  {
    value: "akademik-performans",
    label: "Akademik Performans",
    icon: TrendingUp,
  },
  {
    value: "devamsizlik",
    label: "Devamsızlık",
    icon: CalendarDays,
  },
  {
    value: "sinavlar",
    label: "Sınavlar",
    icon: BarChart2,
  },
  {
    value: "ozel-egitim",
    label: "Özel Eğitim",
    icon: FileText,
  },
  {
    value: "mudahaleler",
    label: "Müdahaleler",
    icon: ShieldAlert,
  },
  {
    value: "ilerleme-takip",
    label: "İlerleme Takibi",
    icon: Trophy,
  },
  {
    value: "anketler",
    label: "Anket/Test",
    icon: PieChart,
  },
] as const;

export const MESLEKI_TABS = [
  {
    value: "hedefler",
    label: "Hedefler & Planlama",
    icon: Target,
  },
] as const;

export const KISISEL_PSIKOSOSYAL_TABS = [
  {
    value: "butuncul-profil",
    label: "Bütüncül Profil",
    icon: Sparkles,
  },
  {
    value: "kisilik-profil",
    label: "Kişilik Profili",
    icon: Brain,
  },
  {
    value: "dijital-kocluk",
    label: "Dijital Koçluk",
    icon: Zap,
  },
  {
    value: "360-degerlendirme",
    label: "360° Değerlendirme",
    icon: Users,
  },
  {
    value: "gorusmeler",
    label: "Görüşmeler",
    icon: MessageCircle,
  },
  {
    value: "risk-degerlendirme",
    label: "Risk Değerlendirme",
    icon: AlertTriangle,
  },
  {
    value: "davranis",
    label: "Davranış Takibi",
    icon: ClipboardList,
  },
] as const;

export const AILE_TABS = [
  {
    value: "veli-gorusmeleri",
    label: "Veli Görüşmeleri",
    icon: Users,
  },
  {
    value: "ev-ziyaretleri",
    label: "Ev Ziyaretleri",
    icon: Heart,
  },
  {
    value: "aile-katilim",
    label: "Aile Katılımı",
    icon: Star,
  },
] as const;

export const STANDARDIZED_TABS = [
  {
    value: "akademik-profil",
    label: "Akademik Profil",
    icon: GraduationCap,
  },
  {
    value: "sosyal-duygusal",
    label: "Sosyal-Duygusal",
    icon: Heart,
  },
  {
    value: "yetenek-ilgi",
    label: "Yetenek & İlgi",
    icon: Star,
  },
  {
    value: "saglik-profil",
    label: "Sağlık Profili",
    icon: Activity,
  },
  {
    value: "davranis-abc",
    label: "Davranış (ABC)",
    icon: AlertTriangle,
  },
  {
    value: "motivasyon",
    label: "Motivasyon",
    icon: Target,
  },
  {
    value: "risk-koruyucu",
    label: "Risk & Koruyucu",
    icon: Shield,
  },
] as const;
