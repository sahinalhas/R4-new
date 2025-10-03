export interface BackendStudent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  className?: string;
  enrollmentDate: string;
  status?: 'active' | 'inactive' | 'graduated';
  avatar?: string;
  parentContact?: string;
  notes?: string;
  gender?: 'K' | 'E';
}

export type Student = {
  id: string;
  ad: string;
  soyad: string;
  sinif: string;
  cinsiyet: "K" | "E";
  risk?: "Düşük" | "Orta" | "Yüksek";
  telefon?: string;
  eposta?: string;
  adres?: string;
  veliAdi?: string;
  veliTelefon?: string;
  etiketler?: string[];
  dogumTarihi?: string;
  okulNo?: string;
  il?: string;
  ilce?: string;
  rehberOgretmen?: string;
  acilKisi?: string;
  acilTelefon?: string;
  ilgiAlanlari?: string[];
  saglikNotu?: string;
  kanGrubu?: string;
};

export function backendToFrontend(backend: BackendStudent): Student {
  const nameParts = backend.name.split(' ');
  const ad = nameParts[0] || '';
  const soyad = nameParts.slice(1).join(' ') || '';
  
  return {
    id: backend.id,
    ad,
    soyad,
    sinif: backend.className || '',
    cinsiyet: backend.gender || 'K',
    telefon: backend.phone,
    eposta: backend.email,
    adres: backend.address,
    dogumTarihi: backend.birthDate,
    veliTelefon: backend.parentContact
  };
}

export function frontendToBackend(frontend: Student): BackendStudent;
export function frontendToBackend(frontend: Student, original: BackendStudent): BackendStudent;
export function frontendToBackend(frontend: Student, original?: BackendStudent): BackendStudent {
  return {
    id: frontend.id,
    name: `${frontend.ad} ${frontend.soyad}`.trim(),
    email: frontend.eposta || original?.email,
    phone: frontend.telefon || original?.phone,
    address: frontend.adres || original?.address,
    className: frontend.sinif || original?.className,
    enrollmentDate: original?.enrollmentDate || new Date().toISOString().split('T')[0],
    status: original?.status || 'active' as const,
    parentContact: frontend.veliTelefon || original?.parentContact,
    birthDate: frontend.dogumTarihi || original?.birthDate,
    avatar: original?.avatar,
    notes: original?.notes,
    gender: frontend.cinsiyet || original?.gender || 'K'
  };
}
