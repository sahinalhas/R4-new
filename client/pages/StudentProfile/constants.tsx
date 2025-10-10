import {
  User,
  GraduationCap,
  Brain,
  MessageCircle,
  Heart,
  Activity,
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
    value: "genel",
    label: "Genel Bilgiler",
    icon: User,
  },
  {
    value: "egitsel",
    label: "Eğitsel Rehberlik",
    icon: GraduationCap,
  },
  {
    value: "kisisel-gelisim",
    label: "Kişisel Gelişim",
    icon: Brain,
  },
  {
    value: "mesleki",
    label: "Mesleki Rehberlik",
    icon: Briefcase,
  },
] as const;

export const GENEL_TABS = [
  {
    value: "ogrenci",
    label: "Öğrenci",
    icon: User,
  },
  {
    value: "saglik",
    label: "Sağlık",
    icon: Activity,
  },
  {
    value: "aile",
    label: "Aile & İletişim",
    icon: Heart,
  },
] as const;

export const EGITSEL_TABS = [
  {
    value: "akademik",
    label: "Akademik",
    icon: TrendingUp,
  },
  {
    value: "calisma-programi",
    label: "Çalışma Programı",
    icon: BookOpen,
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
    value: "ilerleme",
    label: "İlerleme",
    icon: Trophy,
  },
  {
    value: "anketler",
    label: "Anketler",
    icon: PieChart,
  },
] as const;

export const MESLEKI_TABS = [
  {
    value: "hedefler",
    label: "Hedefler & Motivasyon",
    icon: Target,
  },
  {
    value: "kariyer",
    label: "Kariyer Planı",
    icon: Star,
  },
] as const;

export const KISISEL_GELISIM_TABS = [
  {
    value: "sosyal-duygusal",
    label: "Sosyal-Duygusal",
    icon: Heart,
  },
  {
    value: "davranis",
    label: "Davranış",
    icon: ClipboardList,
  },
  {
    value: "risk",
    label: "Risk & Koruyucu",
    icon: AlertTriangle,
  },
  {
    value: "gorusmeler",
    label: "Görüşmeler",
    icon: MessageCircle,
  },
  {
    value: "kisilik",
    label: "Kişilik",
    icon: Brain,
  },
  {
    value: "kocluk",
    label: "Koçluk",
    icon: Zap,
  },
  {
    value: "360-degerlendirme",
    label: "360° Değerlendirme",
    icon: Users,
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
