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
} from "lucide-react";

export const MAIN_TABS = [
  {
    value: "temel",
    label: "Temel Bilgiler",
    icon: User,
  },
  {
    value: "akademik",
    label: "Akademik Alan",
    icon: GraduationCap,
  },
  {
    value: "kisisel",
    label: "Kişisel Gelişim",
    icon: Brain,
  },
  {
    value: "sosyal",
    label: "Sosyal/İletişim",
    icon: MessageCircle,
  },
  {
    value: "aile-iletisimi",
    label: "Aile İletişimi",
    icon: Heart,
  },
  {
    value: "saglik-risk",
    label: "Sağlık & Risk",
    icon: Activity,
  },
] as const;

export const AKADEMIK_TABS = [
  {
    value: "devamsizlik",
    label: "Devamsızlık",
    icon: CalendarDays,
  },
  {
    value: "calisma",
    label: "Çalışma Programı",
    icon: BookOpen,
  },
  {
    value: "dijital-kocluk",
    label: "Dijital Koçluk",
    icon: Zap,
  },
  {
    value: "akademik-performans",
    label: "Akademik Performans",
    icon: TrendingUp,
  },
  {
    value: "mudahaleler",
    label: "Müdahaleler",
    icon: ShieldAlert,
  },
] as const;

export const KISISEL_TABS = [
  {
    value: "kisilik-profil",
    label: "Kişilik Profili",
    icon: Brain,
  },
  {
    value: "hedefler",
    label: "Hedefler & Planlama",
    icon: Target,
  },
  {
    value: "360-degerlendirme",
    label: "360° Değerlendirme",
    icon: Users,
  },
  {
    value: "ilerleme-takip",
    label: "İlerleme Takibi",
    icon: Trophy,
  },
] as const;

export const SOSYAL_TABS = [
  {
    value: "gorusmeler",
    label: "Görüşmeler",
    icon: MessageCircle,
  },
  {
    value: "anketler",
    label: "Anket/Test",
    icon: PieChart,
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

export const SAGLIK_RISK_TABS = [
  {
    value: "saglik",
    label: "Sağlık Bilgileri",
    icon: Activity,
  },
  {
    value: "ozel-egitim",
    label: "Özel Eğitim",
    icon: FileText,
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
  {
    value: "sinavlar",
    label: "Sınav Sonuçları",
    icon: BarChart2,
  },
] as const;
