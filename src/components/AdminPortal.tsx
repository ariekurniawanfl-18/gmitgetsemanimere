import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Plus, Trash2, Edit3, Key, Compass, Users2, FileText, Check, X, Tag, DollarSign } from 'lucide-react';
import { ChurchData, MajelisMember, ChurchActivity, AnnouncementItem, FinancialWarta, ChurchRegistration, MediaItem } from '../types';

interface AdminPortalProps {
  churchData: ChurchData;
  onRefreshData: () => void;
  isAdminLoggedIn: boolean;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
}

export default function AdminPortal({
  churchData,
  onRefreshData,
  isAdminLoggedIn,
  onLoginSuccess,
  onLogout
}: AdminPortalProps) {
  
  // Authentication state
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active sub-sections
  const [activeAdminTab, setActiveAdminTab] = useState<'visimisi' | 'majelis' | 'kegiatan' | 'berita' | 'keuangan' | 'pengajuan'>('pengajuan');

  // Input states for Visi/Misi
  const [visiInput, setVisiInput] = useState(churchData.visimisi.visi);
  const [mottoInput, setMottoInput] = useState(churchData.visimisi.motto);
  const [misiList, setMisiList] = useState<string[]>(churchData.visimisi.misi);
  const [newMisiText, setNewMisiText] = useState('');

  // Editing structures
  const [editingMember, setEditingMember] = useState<Partial<MajelisMember> | null>(null);
  const [editingActivity, setEditingActivity] = useState<Partial<ChurchActivity> | null>(null);
  const [editingAnnounce, setEditingAnnounce] = useState<Partial<AnnouncementItem> | null>(null);
  const [editingFinance, setEditingFinance] = useState<Partial<FinancialWarta> | null>(null);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setTimeout(() => {
      if (password === 'gmitgmere' || password === '41213') {
        onLoginSuccess('session_token_getsemani_mere');
      } else {
        setAuthError('Sandi admin salah! Silakan coba lagi.');
      }
      setAuthLoading(false);
    }, 500);
  };

  // 1. UPDATE VISI MISI
  const handleVisiMisiSave = async () => {
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData = currentRaw ? JSON.parse(currentRaw) : churchData;

      currentData.visimisi = {
        visi: visiInput,
        motto: mottoInput,
        misi: misiList
      };

      localStorage.setItem('gmit_church_data', JSON.stringify(currentData));
      onRefreshData();
      alert('Visi & Misi berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan Visi & Misi.');
    }
  };

  const handleAddMisi = () => {
    if (newMisiText.trim()) {
      setMisiList([...misiList, newMisiText.trim()]);
      setNewMisiText('');
    }
  };

  const handleRemoveMisi = (idx: number) => {
    setMisiList(misiList.filter((_, i) => i !== idx));
  };

  // 2. CRUD MAJELIS
  const handleMajelisSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.role) {
      alert('Nama dan Jabatan wajib diisi!');
      return;
    }
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData = currentRaw ? JSON.parse(currentRaw) : churchData;

      if (editingMember.id) {
        currentData.majelis = currentData.majelis.map(m =>
          m.id === editingMember.id ? { ...m, ...editingMember } as MajelisMember : m
        );
      } else {
        const newMember: MajelisMember = {
          id: 'm_' + Date.now(),
          name: editingMember.name,
          role: editingMember.role,
          phone: editingMember.phone,
          email: editingMember.email
        };
        currentData.majelis.push(newMember);
      }

      localStorage.setItem('gmit_church_data', JSON.stringify(currentData));
      onRefreshData();
      setEditingMember(null);
    } catch (err) {
      alert('Kesalahan merubah data Majelis.');
    }
  };

  const handleMajelisDelete = async (id: string) => {
    if (!confirm('Apakah bapak/ibu yakin ingin menghapus Pelayan Majelis ini?')) return;
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData = currentRaw ? JSON.parse(currentRaw) : churchData;

      currentData.majelis = currentData.majelis.filter(m => m.id !== id);

      localStorage.setItem('gmit_church_data', JSON.stringify(currentData));
      onRefreshData();
    } catch (err) {
      alert('Gagal menghapus Majelis.');
    }
  };

  // 3. CRUD ACTIVITIES
  const handleActivitySave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingActivity?.title || !editingActivity?.dateTime || !editingActivity?.location) {
      alert('Kolom judul, waktu, dan tempat wajib diisi!');
      return;
    }
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData = currentRaw ? JSON.parse(currentRaw) : churchData;

      if (editingActivity.id) {
        currentData.activities = currentData.activities.map(a =>
          a.id === editingActivity.id ? { ...a, ...editingActivity } as ChurchActivity : a
        );
      } else {
        const newAct: ChurchActivity = {
          id: 'act_' + Date.now(),
          title: editingActivity.title,
          dateTime: editingActivity.dateTime,
          location: editingActivity.location,
          speaker: editingActivity.speaker,
          description: editingActivity.description,
          isRegularService: !!editingActivity.isRegularService
        };
        currentData.activities.push(newAct);
      }

      localStorage.setItem('gmit_church_data', JSON.stringify(currentData));
      onRefreshData();
      setEditingActivity(null);
    } catch (err) {
      alert('Gagal menyimpan jadwal kegiatan.');
    }
  };

  const handleActivityDelete = async (id: string) => {
    if (!confirm('Konfirmasi hapus jadwal kegiatan?')) return;
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData = currentRaw ? JSON.parse(currentRaw) : churchData;

      currentData.activities = currentData.activities.filter(a => a.id !== id);

      localStorage.setItem('gmit_church_data', JSON.stringify(currentData));
      onRefreshData();
    } catch (err) {
      alert('Gagal menghapus kegiatan.');
    }
  };

  // 4. CRUD ANNOUNCEMENTS
  const handleAnnounceSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingAnnounce?.title || !editingAnnounce?.content) {
      alert('Judul dan naskah isi pengumuman wajib diisi!');
      return;
    }
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData = currentRaw ? JSON.parse(currentRaw) : churchData;

      if (editingAnnounce.id) {
        currentData.announcements = currentData.announcements.map(ann =>
          ann.id === editingAnnounce.id ? { ...ann, ...editingAnnounce } as AnnouncementItem : ann
        );
      } else {
        const newAnn: AnnouncementItem = {
          id: 'ann_' + Date.now(),
          title: editingAnnounce.title,
          content: editingAnnounce.content,
          date: editingAnnounce.date || new Date().toISOString().split('T')[0],
          category: editingAnnounce.category || 'Pengumuman'
        };
        currentData.announcements.push(newAnn);
      }

      localStorage.setItem('gmit_church_data', JSON.stringify(currentData));
      onRefreshData();
      setEditingAnnounce(null);
    } catch (err) {
      alert('Gagal menyimpan pengumuman.');
    }
  };

  const handleAnnounceDelete = async (id: string) => {
    if (!confirm('Hapus publikasi warta jemaat ini?')) return;
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData = currentRaw ? JSON.parse(currentRaw) : churchData;

      currentData.announcements = currentData.announcements.filter(ann => ann.id !== id);

      localStorage.setItem('gmit_church_data', JSON.stringify(currentData));
      onRefreshData();
    } catch (err) {
      alert('Gagal menghapus.');
    }
  };

  // 5. CRUD KEUANGAN
  const handleFinanceSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingFinance?.title || !editingFinance?.amount) {
      alert('Uraian transaksi dan nominal wajib diisi!');
      return;
    }
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData = currentRaw ? JSON.parse(currentRaw) : churchData;

      if (editingFinance.id) {
        currentData.financials = currentData.financials.map(f =>
          f.id === editingFinance.id ? { ...f, ...editingFinance, amount: Number(editingFinance.amount) } as FinancialWarta : f
        );
      } else {
        const newFin: FinancialWarta = {
          id: 'fin_' + Date.now(),
          title: editingFinance.title,
          category: editingFinance.category || 'Pemasukan',
          amount: Number(editingFinance.amount),
          date: editingFinance.date || new Date().toISOString().split('T')[0],
          description: editingFinance.description
        };
        currentData.financials.push(newFin);
      }

      localStorage.setItem('gmit_church_data', JSON.stringify(currentData));
      onRefreshData();
      setEditingFinance(null);
    } catch (err) {
      alert('Gagal menyimpan kas.');
    }
  };

  const handleFinanceDelete = async (id: string) => {
    if (!confirm('Konfirmasi hapus catatan keuangan ini?')) return;
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData = currentRaw ? JSON.parse(currentRaw) : churchData;

      currentData.financials = currentData.financials.filter(f => f.id !== id);

      localStorage.setItem('gmit_church_data', JSON.stringify(currentData));
      onRefreshData();
    } catch (err) {
      alert('Gagal.');
    }
  };

  // 6. PROCESS REGISTRATIONS (Status update / delete)
  const handleRegistrationVerify = async (id: string, status: 'Disetujui' | 'Ditolak' | 'Pending') => {
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData = currentRaw ? JSON.parse(currentRaw) : churchData;

      currentData.registrations = currentData.registrations.map(r =>
        r.id === id ? { ...r, status } : r
      );

      localStorage.setItem('gmit_church_data', JSON.stringify(currentData));
      onRefreshData();
    } catch (err) {
      alert('Gagal memperbarui status registrasi.');
    }
  };

  const handleRegistrationDelete = async (id: string) => {
    if (!confirm('Hapus log pengajuan pendaftaran jemaat ini?')) return;
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData = currentRaw ? JSON.parse(currentRaw) : churchData;

      currentData.registrations = currentData.registrations.filter(r => r.id !== id);

      localStorage.setItem('gmit_church_data', JSON.stringify(currentData));
      onRefreshData();
    } catch (err) {
      alert('Gagal menghapus registrasi.');
    }
  };

  // If not logged in, show elegant login dialog
  if (!isAdminLoggedIn) {
    return (
      <div className="bg-church-bg py-20 px-4 min-h-[500px] flex items-center justify-center">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-100 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex bg-gmit-blue-light text-gmit-blue p-3.5 rounded-full ring-4 ring-gmit-blue-light/50 shadow-inner">
              <ShieldCheck className="h-8 w-8 text-gmit-blue" />
            </div>
            <h3 className="font-display font-extrabold text-2xl text-gmit-blue-deep leading-tight">PORTAL ADMIN GEREJA</h3>
            <p className="text-xs text-gray-400">Autentikasi internal pengurus majelis harian Getsemani Mere.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Kata Sandi Akses</label>
              <div className="relative flex items-center">
                <Key className="absolute left-3.5 h-4 w-4 text-gray-400 stroke-[2.5]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ketik 'getsemani' atau '12345'..."
                  className="w-full text-sm border border-gray-150 rounded px-4 py-2.5 pl-10 bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-gmit-blue"
                />
              </div>
              <span className="text-[10px] text-gray-400 italic block mt-1">
                *Sandi trial default: <strong className="font-semibold text-gmit-gold-dark font-mono bg-gmit-gold-light px-1">getsemani</strong> atau <strong className="font-semibold text-gmit-gold-dark font-mono bg-gmit-gold-light px-1">12345</strong>
              </span>
            </div>

            {authError && (
              <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-150 p-2.5 rounded leading-normal">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 bg-gmit-blue-deep hover:bg-gmit-blue text-white rounded font-bold text-xs tracking-wider uppercase shadow hover:shadow-lg transition-all"
            >
              {authLoading ? 'Mengecek...' : 'MASUK KE DASHBOARD'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-church-bg py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header of Admin Portal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
          <div className="text-left">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold uppercase tracking-widest text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Sesi Admin Aktif</span>
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-gmit-blue-deep tracking-tight mt-1">
              DASHBOARD PENGURUS GEREJA
            </h2>
          </div>
          <button
            onClick={onLogout}
            className="self-start sm:self-center px-4 py-2 border border-red-700 hover:bg-red-50 text-red-700 hover:text-red-900 font-bold font-display rounded text-xs uppercase"
          >
            Keluar Sesi
          </button>
        </div>

        {/* Outer Grid: Tab menu & actual panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Menu selection list - lg:3 */}
          <div className="lg:col-span-3 bg-white border rounded-xl overflow-hidden shadow-sm">
            <span className="bg-slate-50 border-b px-4 py-3 block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              RUANG FITUR KELOLA
            </span>
            <div className="flex flex-col divide-y divide-gray-100 text-left">
              {[
                { id: 'pengajuan', label: 'Verifikasi Pengajuan', badge: churchData.registrations.filter(r => r.status === 'Pending').length },
                { id: 'visimisi', label: 'Atur Visi & Misi' },
                { id: 'majelis', label: 'Struktur Majelis MJH' },
                { id: 'kegiatan', label: 'Jadwal Kebaktian' },
                { id: 'berita', label: 'Warta & Pengumuman' },
                { id: 'keuangan', label: 'Warta Keuangan Kas' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id as any)}
                  className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider font-display flex items-center justify-between transition-all ${
                    activeAdminTab === tab.id
                      ? 'bg-gmit-blue-light/50 border-l-4 border-gmit-blue text-gmit-blue'
                      : 'hover:bg-slate-50 text-slate-650 text-slate-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="bg-amber-600 text-white font-mono text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Panel views - lg:9 */}
          <div className="lg:col-span-9 bg-white border rounded-xl shadow p-6 max-w-full">
            
            {/* 1. VISI & MISI PANEL */}
            {activeAdminTab === 'visimisi' && (
              <div className="space-y-6 text-left">
                <div className="flex items-center space-x-2 border-b pb-3 color-gmit-blue">
                  <Compass className="h-5 w-5 text-gmit-gold" />
                  <h3 className="font-display font-bold text-lg text-gmit-blue-deep uppercase">Ubah Visi & Misi Jemaat</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Rumusan Visi Jemaat Mere</label>
                    <textarea
                      rows={3}
                      value={visiInput}
                      onChange={(e) => setVisiInput(e.target.value)}
                      className="w-full text-sm border rounded p-3 bg-slate-50 focus:bg-white outlook-none outline-none focus:ring-1 focus:ring-gmit-blue"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Motto Jemaat</label>
                    <input
                      type="text"
                      value={mottoInput}
                      onChange={(e) => setMottoInput(e.target.value)}
                      className="w-full text-sm border rounded p-3 bg-slate-50 focus:bg-white outlook-none outline-none focus:ring-1 focus:ring-gmit-blue"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 uppercase block">Rumusan Poin Misi Gereja</label>
                    
                    <ul className="space-y-2 text-sm text-slate-700">
                      {misiList.map((m, idx) => (
                        <li key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded border">
                          <span className="pr-4 leading-normal">{m}</span>
                          <button
                            onClick={() => handleRemoveMisi(idx)}
                            className="text-red-600 p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* Add Misi form */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Ketik rincian misi pelayanan baru..."
                        value={newMisiText}
                        onChange={(e) => setNewMisiText(e.target.value)}
                        className="text-sm border rounded px-3 py-2 flex-1 outline-none focus:bg-white"
                      />
                      <button
                        onClick={handleAddMisi}
                        className="bg-gmit-blue hover:bg-gmit-blue-deep text-white text-xs font-bold font-display px-4 rounded"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleVisiMisiSave}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase font-display rounded shadow"
                >
                  Simpan Seluruh Rumusan
                </button>
              </div>
            )}

            {/* 2. MAJELIS MJH CRUD PANEL */}
            {activeAdminTab === 'majelis' && (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b pb-3 color-gmit-blue">
                  <div className="flex items-center space-x-2">
                    <Users2 className="h-5 w-5 text-gmit-gold" />
                    <h3 className="font-display font-bold text-lg text-gmit-blue-deep uppercase">Manajemen Majelis Jemaat Harian</h3>
                  </div>
                  <button
                    onClick={() => setEditingMember({ name: '', role: '', phone: '', email: '' })}
                    className="bg-gmit-blue hover:bg-gmit-blue-deep text-white font-bold text-xs font-display px-3 py-1.5 rounded flex items-center space-x-1 uppercase"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Presbiter</span>
                  </button>
                </div>

                {editingMember && (
                  <form onSubmit={handleMajelisSave} className="bg-slate-50 border p-5 rounded-lg space-y-4">
                    <h4 className="font-display font-bold text-sm text-gmit-blue-deep uppercase">
                      {editingMember.id ? 'Ubah Profil Presbiter' : 'Tambah Presbiter Baru'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Nama Lengkap & Gelar *</label>
                        <input
                          type="text"
                          required
                          value={editingMember.name || ''}
                          onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                          placeholder="Contoh: Pnt. Sarah Leka"
                          className="w-full text-sm border rounded px-3 py-2 bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Jabatan / Peranan Pelayanan *</label>
                        <input
                          type="text"
                          required
                          value={editingMember.role || ''}
                          onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                          placeholder="Ketua, Sekretaris, Bendahara, UPP, dll"
                          className="w-full text-sm border rounded px-3 py-2 bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">No. WhatsApp</label>
                        <input
                          type="text"
                          value={editingMember.phone || ''}
                          onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                          placeholder="+62 812..."
                          className="w-full text-sm border rounded px-3 py-2 bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Email</label>
                        <input
                          type="email"
                          value={editingMember.email || ''}
                          onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                          placeholder="email@gmit.or.id"
                          className="w-full text-sm border rounded px-3 py-2 bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded text-xs uppercase"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingMember(null)}
                        className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold px-4 py-2 rounded text-xs uppercase"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                )}

                {/* List Table */}
                <div className="overflow-x-auto border rounded-xl bg-white">
                  <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-xs border-b">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Nama Presbiter</th>
                        <th className="px-5 py-3 font-semibold">Jabatan</th>
                        <th className="px-5 py-3 font-bold text-center">Aksi Hubungan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {churchData.majelis.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 font-medium text-slate-850">{member.name}</td>
                          <td className="px-5 py-3">
                            <span className="text-xs bg-gmit-gold-light text-[#a8731f] border border-gmit-gold/15 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                              {member.role}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-center flex items-center justify-center space-x-2.5">
                            <button
                              onClick={() => setEditingMember(member)}
                              className="text-gmit-blue hover:text-gmit-blue-deep bg-slate-50 p-2 border rounded"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleMajelisDelete(member.id)}
                              className="text-red-650 text-red-600 hover:text-red-900 bg-red-50 p-2 border rounded border-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. ACTIVITIES (IBADAH UTAMA) PANER */}
            {activeAdminTab === 'kegiatan' && (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b pb-3 color-gmit-blue">
                  <div className="flex items-center space-x-2">
                    <Compass className="h-5 w-5 text-gmit-gold" />
                    <h3 className="font-display font-bold text-lg text-gmit-blue-deep uppercase">Pengelolaan Jadwal Kebaktian</h3>
                  </div>
                  <button
                    onClick={() => setEditingActivity({ title: '', dateTime: '', location: '', speaker: '', description: '', isRegularService: true })}
                    className="bg-gmit-blue hover:bg-gmit-blue-deep text-white font-bold text-xs font-display px-3 py-1.5 rounded flex items-center space-x-1 uppercase"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Kebaktian Baru</span>
                  </button>
                </div>

                {editingActivity && (
                  <form onSubmit={handleActivitySave} className="bg-slate-50 border p-5 rounded-lg space-y-4">
                    <h4 className="font-display font-bold text-sm text-gmit-blue-deep uppercase">Form Kegiatan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Uraian Nama Ibadah *</label>
                        <input
                          type="text"
                          required
                          value={editingActivity.title || ''}
                          onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                          className="w-full text-sm border rounded px-3 py-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Waktu Penyelenggaraan *</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Setiap Hari Minggu - Mulai 07:00 WITA"
                          value={editingActivity.dateTime || ''}
                          onChange={(e) => setEditingActivity({ ...editingActivity, dateTime: e.target.value })}
                          className="w-full text-sm border rounded px-3 py-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Tempat / Lokasi Altar *</label>
                        <input
                          type="text"
                          required
                          placeholder="Gedung Gereja Mere / Rayon-rayon"
                          value={editingActivity.location || ''}
                          onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })}
                          className="w-full text-sm border rounded px-3 py-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Pendeta / Pelayan Firman</label>
                        <input
                          type="text"
                          placeholder="Nama pengkhotbah jemaat"
                          value={editingActivity.speaker || ''}
                          onChange={(e) => setEditingActivity({ ...editingActivity, speaker: e.target.value })}
                          className="w-full text-sm border rounded px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Penjelasan Ringkas Liturgi</label>
                      <input
                        type="text"
                        value={editingActivity.description || ''}
                        onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                        className="w-full text-sm border rounded px-3 py-2"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="regularCheck"
                        checked={editingActivity.isRegularService || false}
                        onChange={(e) => setEditingActivity({ ...editingActivity, isRegularService: e.target.checked })}
                      />
                      <label htmlFor="regularCheck" className="text-xs font-bold text-slate-700">Kebaktian Utama Liturgis Jemaat</label>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded text-xs uppercase">Simpan</button>
                      <button type="button" onClick={() => setEditingActivity(null)} className="bg-slate-300 text-slate-850 font-bold px-4 py-2 rounded text-xs uppercase">Batal</button>
                    </div>
                  </form>
                )}

                {/* List Table of Actions */}
                <div className="overflow-x-auto border rounded bg-white">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-xs border-b">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Nama Ibadah</th>
                        <th className="px-5 py-3 font-semibold">Lokasi</th>
                        <th className="px-5 py-3 font-semibold text-center">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {churchData.activities.map((act) => (
                        <tr key={act.id} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 font-bold text-gmit-blue-deep">{act.title}</td>
                          <td className="px-5 py-3 text-slate-500 text-xs">{act.location}</td>
                          <td className="px-5 py-3 text-center">
                            <button
                              onClick={() => handleActivityDelete(act.id)}
                              className="text-red-650 text-red-600 bg-red-50 p-2 rounded border border-red-150"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. ANNOUNCEMENTS / PUBS PANLE */}
            {activeAdminTab === 'berita' && (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b pb-3 color-gmit-blue">
                  <div className="flex items-center space-x-2">
                    <Compass className="h-5 w-5 text-gmit-gold" />
                    <h3 className="font-display font-bold text-lg text-gmit-blue-deep uppercase">Manajemen Publikasi Berita Jemaat</h3>
                  </div>
                  <button
                    onClick={() => setEditingAnnounce({ title: '', content: '', category: 'Pengumuman' })}
                    className="bg-gmit-blue hover:bg-gmit-blue-deep text-white font-bold text-xs font-display px-3 py-1.5 rounded flex items-center space-x-1 uppercase"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Warta Baru</span>
                  </button>
                </div>

                {editingAnnounce && (
                  <form onSubmit={handleAnnounceSave} className="bg-slate-50 border p-5 rounded-lg space-y-4">
                    <h4 className="font-display font-bold text-sm text-gmit-blue-deep uppercase">Form Publikasi Pengumuman</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Kategori Publikasi</label>
                        <select
                          required
                          value={editingAnnounce.category || 'Pengumuman'}
                          onChange={(e) => setEditingAnnounce({ ...editingAnnounce, category: e.target.value as any })}
                          className="w-full text-sm border rounded px-3 py-2"
                        >
                          <option value="Warta Jemaat">Warta Jemaat</option>
                          <option value="Pengumuman">Pengumuman</option>
                          <option value="Berita">Pers / Berita</option>
                          <option value="Kegiatan">Acara / Kegiatan</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Judul Berita *</label>
                        <input
                          type="text"
                          required
                          value={editingAnnounce.title || ''}
                          onChange={(e) => setEditingAnnounce({ ...editingAnnounce, title: e.target.value })}
                          className="w-full text-sm border rounded px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Isi Rubrik Naskah Pengumuman *</label>
                      <textarea
                        rows={5}
                        required
                        value={editingAnnounce.content || ''}
                        onChange={(e) => setEditingAnnounce({ ...editingAnnounce, content: e.target.value })}
                        className="w-full text-sm border rounded p-3 bg-white resize-none"
                      />
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded text-xs uppercase">Sebarkan</button>
                      <button type="button" onClick={() => setEditingAnnounce(null)} className="bg-slate-300 text-slate-850 font-bold px-4 py-2 rounded text-xs uppercase">Batal</button>
                    </div>
                  </form>
                )}

                {/* List Table of Articles */}
                <div className="overflow-x-auto border rounded bg-white">
                  <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-xs border-b">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Judul Pengumuman</th>
                        <th className="px-5 py-3 font-semibold">Hari Disiarkan</th>
                        <th className="px-5 py-3 font-bold text-center">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {churchData.announcements.map((ann) => (
                        <tr key={ann.id} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 font-bold text-slate-800 leading-tight">
                            <span className="text-[10px] font-bold uppercase tracking-wider block text-gmit-gold-dark mb-1">{ann.category}</span>
                            <span>{ann.title}</span>
                          </td>
                          <td className="px-5 py-3 text-slate-400 font-mono text-xs">{ann.date}</td>
                          <td className="px-5 py-3 text-center">
                            <button
                              onClick={() => handleAnnounceDelete(ann.id)}
                              className="text-red-650 text-red-600 bg-red-50 p-2 rounded border border-red-150"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. FINANCES (WARTA KEUANGAN) PANELA */}
            {activeAdminTab === 'keuangan' && (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b pb-3 color-gmit-blue">
                  <div className="flex items-center space-x-2">
                    <Compass className="h-5 w-5 text-gmit-gold" />
                    <h3 className="font-display font-bold text-lg text-gmit-blue-deep uppercase">Arsip Transparansi Kas Jemaat</h3>
                  </div>
                  <button
                    onClick={() => setEditingFinance({ title: '', category: 'Pemasukan', amount: 0, date: new Date().toISOString().split('T')[0] })}
                    className="bg-gmit-blue hover:bg-gmit-blue-deep text-white font-bold text-xs font-display px-3 py-1.5 rounded flex items-center space-x-1 uppercase"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Catat Arus Kas</span>
                  </button>
                </div>

                {editingFinance && (
                  <form onSubmit={handleFinanceSave} className="bg-slate-50 border p-5 rounded-lg space-y-4">
                    <h4 className="font-display font-bold text-sm text-gmit-blue-deep uppercase">Buku Catatan Keuangan Baru</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Jenis Keuangan</label>
                        <select
                          required
                          value={editingFinance.category || 'Pemasukan'}
                          onChange={(e) => setEditingFinance({ ...editingFinance, category: e.target.value as any })}
                          className="w-full text-sm border rounded px-3 py-2 bg-white"
                        >
                          <option value="Pemasukan">Pemasukan (Kolekte, Syukur, Persepuluhan)</option>
                          <option value="Pengeluaran">Pengeluaran (Bantuan, Listrik, Konsistori)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Uraian Kas (Judul) *</label>
                        <input
                          type="text"
                          required
                          placeholder="Persembahan Ibadah Utama..."
                          value={editingFinance.title || ''}
                          onChange={(e) => setEditingFinance({ ...editingFinance, title: e.target.value })}
                          className="w-full text-sm border rounded px-3 py-2"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Jumlah Uang (Rupiah) *</label>
                        <input
                          type="number"
                          required
                          placeholder="Contoh: 1500000"
                          value={editingFinance.amount || ''}
                          onChange={(e) => setEditingFinance({ ...editingFinance, amount: Number(e.target.value) })}
                          className="w-full text-sm border rounded px-3 py-2"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Tanggal Pembukuan</label>
                        <input
                          type="date"
                          value={editingFinance.date || ''}
                          onChange={(e) => setEditingFinance({ ...editingFinance, date: e.target.value })}
                          className="w-full text-sm border rounded px-3 py-2 animate-none"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded text-xs uppercase">Simpan Kas</button>
                      <button type="button" onClick={() => setEditingFinance(null)} className="bg-slate-300 text-slate-850 font-bold px-4 py-2 rounded text-xs uppercase">Batal</button>
                    </div>
                  </form>
                )}

                {/* Table list */}
                <div className="overflow-x-auto border rounded bg-white">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-xs border-b">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Tujuan Rekaman</th>
                        <th className="px-5 py-3 font-semibold">Jenis</th>
                        <th className="px-5 py-3 font-semibold text-right">Jumlah</th>
                        <th className="px-5 py-3 font-semibold text-center">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {churchData.financials.map((fin) => (
                        <tr key={fin.id} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 font-medium text-slate-800">{fin.title}</td>
                          <td className="px-5 py-3 text-center">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                              fin.category === 'Pemasukan' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {fin.category}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-slate-700">Rp {fin.amount.toLocaleString()}</td>
                          <td className="px-5 py-3 text-center">
                            <button
                              onClick={() => handleFinanceDelete(fin.id)}
                              className="text-red-650 text-red-600 bg-red-50 p-1.5 rounded"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. VERIFY REGISTRATION FORMS (APPROVED / DECILNE) */}
            {activeAdminTab === 'pengajuan' && (
              <div className="space-y-6 text-left">
                <div className="flex items-center space-x-2 border-b pb-3 color-gmit-blue">
                  <FileText className="h-5 w-5 text-gmit-gold" />
                  <h3 className="font-display font-bold text-lg text-gmit-blue-deep uppercase">Verifikasi Pengisian Dokumen Jemaat</h3>
                </div>

                <div className="space-y-4">
                  {churchData.registrations.length > 0 ? (
                    churchData.registrations.map((item) => (
                      <div
                        key={item.id}
                        className={`border rounded-xl p-5 shadow-sm bg-white border-gray-150 relative ${
                          item.status === 'Pending' ? 'ring-2 ring-amber-500/20' : ''
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2.5">
                              <span className="text-xs font-bold uppercase py-0.5 px-2.5 rounded bg-gmit-blue-light text-gmit-blue border">
                                {item.type}
                              </span>
                              <span className="font-mono text-[10px] text-gray-400">ID REG: {item.id}</span>
                              <span className="text-[10px] text-slate-450 text-gray-400">Tgl: {item.dateSubmitted}</span>
                            </div>

                            <p className="font-display font-bold text-base text-slate-800">
                              Pemohon: {item.applicantName}
                            </p>

                            {/* Contact block */}
                            <div className="flex items-center space-x-4 text-xs text-slate-600">
                              <span>Telp: <strong>{item.phone}</strong></span>
                              {item.email && <span>Email: <strong>{item.email}</strong></span>}
                            </div>

                            {/* Specific Custom Form info */}
                            <div className="mt-3 bg-slate-50 border p-3 rounded text-xs text-slate-700 space-y-1.5 max-w-xl">
                              <div className="font-extrabold uppercase text-[10px] text-gmit-gold-dark tracking-wider">Detail Informasi Formulir:</div>
                              {Object.entries(item.formData).map(([k, v]) => (
                                <div key={k} className="flex flex-col sm:flex-row sm:justify-between border-b pb-0.5 last:border-0 mr-4">
                                  <span className="text-gray-400 uppercase text-[10px] sm:w-1/3 leading-normal">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                  <span className="font-medium sm:w-2/3 leading-relaxed text-slate-800">{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Control actions */}
                          <div className="self-end md:self-start flex items-center space-x-2">
                            {item.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleRegistrationVerify(item.id, 'Disetujui')}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center space-x-1.5 text-xs uppercase"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Setujui</span>
                                </button>
                                <button
                                  onClick={() => handleRegistrationVerify(item.id, 'Ditolak')}
                                  className="px-3.5 py-1.5 bg-red-650 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center space-x-1.5 text-xs uppercase"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span>Tolak</span>
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className={`px-2.5 py-1 rounded font-mono font-bold text-[10px] uppercase ${
                                  item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                                }`}>
                                  Status: {item.status}
                                </span>
                                <button
                                  onClick={() => handleRegistrationVerify(item.id, 'Pending')}
                                  className="text-xs text-slate-500 underline hover:text-slate-700"
                                >
                                  Batalkan
                                </button>
                              </div>
                            )}

                            <button
                              onClick={() => handleRegistrationDelete(item.id)}
                              className="text-gray-400 hover:text-red-600 p-2 hover:bg-slate-100 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400 text-sm italic">
                      Luar biasa! Belum ada pengajuan masuk yang terdaftar di antrean sekretaris.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
