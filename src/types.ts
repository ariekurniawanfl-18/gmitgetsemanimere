export interface MajelisMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  phone?: string;
  email?: string;
}

export interface ChurchActivity {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  speaker?: string;
  description?: string;
  isRegularService?: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Warta Jemaat' | 'Pengumuman' | 'Berita' | 'Kegiatan';
  imageUrl?: string;
}

export interface FinancialWarta {
  id: string;
  title: string;
  category: 'Pemasukan' | 'Pengeluaran';
  amount: number;
  date: string;
  description?: string;
}

export type RegistrationType = 'baptis' | 'sidi' | 'nikah' | 'atestasi';

export interface ChurchRegistration {
  id: string;
  type: RegistrationType;
  applicantName: string;
  phone: string;
  email: string;
  dateSubmitted: string;
  status: 'Pending' | 'Disetujui' | 'Ditolak';
  formData: Record<string, string>;
}

export interface MediaItem {
  id: string;
  title: string;
  imageUrl: string;
  type: 'foto' | 'video';
  videoUrl?: string;
  description?: string;
}

export interface ChurchData {
  visimisi: {
    visi: string;
    misi: string[];
    motto: string;
  };
  majelis: MajelisMember[];
  activities: ChurchActivity[];
  announcements: AnnouncementItem[];
  financials: FinancialWarta[];
  registrations: ChurchRegistration[];
  gallery: MediaItem[];
}
