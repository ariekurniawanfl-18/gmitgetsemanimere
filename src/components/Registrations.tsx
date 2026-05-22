import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { FileText, Send, CheckCircle2, Search, RefreshCw, UserCheck, HelpCircle } from 'lucide-react';
import { ChurchRegistration, RegistrationType } from '../types';

interface RegistrationsProps {
  onRegisterSubmit: (regData: any) => Promise<ChurchRegistration | null>;
  registrations: ChurchRegistration[];
}

export default function Registrations({ onRegisterSubmit, registrations }: RegistrationsProps) {
  const [activeFormType, setActiveFormType] = useState<RegistrationType>('baptis');
  const [submitting, setSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  // Search input for status check
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<ChurchRegistration | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Form inputs
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Custom form fields matching layout
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  useEffect(() => {
    // Reset fields on form change
    setApplicantName('');
    setPhone('');
    setEmail('');
    setCustomFields({});
    setSuccessCode(null);
  }, [activeFormType]);

  const handleFieldChange = (key: string, value: string) => {
    setCustomFields(p => ({ ...p, [key]: value }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phone) {
      alert('Mohon isi nama lengkap dan nomor WhatsApp aktif Anda!');
      return;
    }

    setSubmitting(true);
    try {
      const result = await onRegisterSubmit({
        type: activeFormType,
        applicantName,
        phone,
        email,
        formData: {
          ...customFields,
          catatanTambahan: customFields.catatanTambahan || "Tidak ada"
        }
      });

      if (result) {
        setSuccessCode(result.id);
        // Persist code in visitor's localStorage for fast status lookup
        const savedCodes = JSON.parse(localStorage.getItem('gmit_submit_ids') || '[]');
        savedCodes.push(result.id);
        localStorage.setItem('gmit_submit_ids', JSON.stringify(savedCodes));
      }
    } catch (err) {
      console.error(err);
      alert('Pendaftaran gagal terkirim. Silakan kontak administrator.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusSearch = (e: FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const code = searchCode.trim();
    if (!code) {
      setSearchResult(null);
      return;
    }
    const found = registrations.find(r => r.id.toLowerCase() === code.toLowerCase());
    setSearchResult(found || null);
  };

  // Quick lookup of local user submitted apps
  const [localSavedApps, setLocalSavedApps] = useState<ChurchRegistration[]>([]);
  const loadLocals = () => {
    const list = JSON.parse(localStorage.getItem('gmit_submit_ids') || '[]');
    const matched = registrations.filter(r => list.includes(r.id));
    setLocalSavedApps(matched);
  };

  useEffect(() => {
    loadLocals();
  }, [registrations]);

  return (
    <div className="bg-church-bg py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-gmit-gold font-bold tracking-widest text-xs uppercase font-mono block">Layanan Sakramen & Keanggotaan</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-gmit-blue-deep tracking-tight">
            PENGAJUAN & ADMINISTRASI JEMAAT
          </h2>
          <div className="h-1 w-20 bg-gmit-gold mx-auto rounded-full"></div>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Daftarkan diri atau anggota keluarga Anda untuk peribadatan suci, baptisan, katekisasi sidi, pemberkatan pernikahan, serta mutasi kepindahan (atestasi) secara praktis.
          </p>
        </div>

        {/* Outer Split layout: Form + status tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Wizard column - lg:8 */}
          <div className="lg:col-span-8 bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden">
            
            {/* Form selectors */}
            <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-50 border-b border-gray-100">
              {(['baptis', 'sidi', 'nikah', 'atestasi'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFormType(type)}
                  className={`py-4 px-2 text-center text-xs md:text-sm font-bold font-display uppercase tracking-wider transition-all border-b-2 ${
                    activeFormType === type
                      ? 'bg-white border-gmit-gold text-gmit-blue-deep'
                      : 'border-transparent text-slate-505 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {type === 'baptis' && 'Baptis Anak/Dewasa'}
                  {type === 'sidi' && 'Peneguhan Sidi'}
                  {type === 'nikah' && 'Nikah Kudus'}
                  {type === 'atestasi' && 'Atestasi Jemaat'}
                </button>
              ))}
            </div>

            {/* Inner Form content */}
            <div className="p-6 md:p-8">
              {successCode ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4 max-w-md mx-auto"
                >
                  <div className="inline-flex bg-emerald-100 text-emerald-800 p-4 rounded-full shadow-inner animate-bounce">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-gmit-blue-deep">Pendaftaran Berhasil!</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Formulir pengajuan Anda telah terekam pada server gereja Mere. Harap catat kode registrasi Anda di bawah untuk pengecekan status berkala.
                  </p>
                  
                  <div className="bg-gmit-blue-light border border-gmit-blue/20 rounded p-3 font-mono text-base font-bold text-gmit-blue">
                    KODE REG: {successCode}
                  </div>

                  <p className="text-xs text-slate-500 italic">
                    *Tunjukkan kode ini kepada Sekretariat Majelis GMIT Getsemani Mere untuk melampirkan berkas fisik pendukung (Akta lahir, fotokopi KTP, dll).
                  </p>

                  <button
                    onClick={() => {
                      setSuccessCode(null);
                      loadLocals();
                    }}
                    className="mt-4 px-6 py-2 bg-gmit-gold hover:bg-gmit-gold-dark text-gmit-blue-deep font-bold font-display rounded shadow transition"
                  >
                    Kirim Pengajuan Lain
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  
                  {/* Common Details section */}
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-gmit-blue-deep">
                      {activeFormType === 'baptis' && 'Formulir Pendaftaran Baptisan Kudus'}
                      {activeFormType === 'sidi' && 'Formulir Katekisasi / Peneguhan Sidi'}
                      {activeFormType === 'nikah' && 'Formulir Pernikahan / Pernikahan Suci'}
                      {activeFormType === 'atestasi' && 'Formulir Surat Atestasi / Pindah Jemaat'}
                    </h3>
                    <p className="text-xs text-gray-400">Silakan melengkapi data pemohon di bawah ini dengan lengkap dan valid sesuai KTP.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nama Lengkap Pemohon *</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="Contoh: Paulus Daniel Leka"
                        className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">No. WhatsApp Aktif *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 08123999xxxx"
                        className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Alamat Email (Opsional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Contoh: paulus@email.com"
                        className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-150" />

                  {/* Specific Fields depending on form type */}
                  <div className="space-y-4">
                    <h4 className="font-display font-semibold text-sm text-gmit-gold tracking-widest uppercase">DETAIL PERSYARATAN KHUSUS</h4>

                    {activeFormType === 'baptis' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Tempat & Tanggal Lahir Anak</label>
                          <input
                            type="text"
                            required
                            placeholder="Mere, 10 Maret 2026"
                            onChange={(e) => handleFieldChange('tempatTanggalLahir', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nama Lengkap Ayah Kandung</label>
                          <input
                            type="text"
                            required
                            placeholder="Ayah kandung"
                            onChange={(e) => handleFieldChange('namaAyah', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nama Lengkap Ibu Kandung</label>
                          <input
                            type="text"
                            required
                            placeholder="Ibu kandung"
                            onChange={(e) => handleFieldChange('namaIbu', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Saksi-Saksi Baptis (Wali)</label>
                          <input
                            type="text"
                            placeholder="Nama saksi baptisan"
                            onChange={(e) => handleFieldChange('namaSaksiBaptis', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {activeFormType === 'sidi' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Tempat Tanggal Lahir Katekisan</label>
                          <input
                            type="text"
                            required
                            placeholder="Kupang, 12 Agustus 2009"
                            onChange={(e) => handleFieldChange('tempatTanggalLahir', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Asal Lingkungan / Rayon Jemaat</label>
                          <input
                            type="text"
                            required
                            placeholder="Rayon I Mere / Rayon II Mere"
                            onChange={(e) => handleFieldChange('alamatRayon', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nama Lengkap Orang Tua Kandung</label>
                          <input
                            type="text"
                            required
                            placeholder="Nama Ayah & Ibu"
                            onChange={(e) => handleFieldChange('namaOrangTua', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {activeFormType === 'nikah' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nama Lengkap Calon Suami</label>
                          <input
                            type="text"
                            required
                            placeholder="Calon mempelai pria"
                            onChange={(e) => handleFieldChange('calonSuami', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nama Lengkap Calon Istri</label>
                          <input
                            type="text"
                            required
                            placeholder="Calon mempelai wanita"
                            onChange={(e) => handleFieldChange('calonIstri', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Rencana Tanggal Pemberkatan</label>
                          <input
                            type="date"
                            required
                            onChange={(e) => handleFieldChange('rencanaTanggal', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Gereja / Klasis Pembaptisan Asal</label>
                          <input
                            type="text"
                            placeholder="Contoh: GMIT Getsemani Mere"
                            onChange={(e) => handleFieldChange('tempatBaptisAsal', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {activeFormType === 'atestasi' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Jenis Atestasi</label>
                          <select
                            required
                            onChange={(e) => handleFieldChange('jenisAtestasi', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          >
                            <option value="masuk">Atestasi Masuk (Bergabung ke Getsemani Mere)</option>
                            <option value="keluar">Atestasi Keluar (Pindah ke Gereja Lain)</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Gereja Asal / Gereja Tujuan</label>
                          <input
                            type="text"
                            required
                            placeholder="Nama gereja dan alamatnya"
                            onChange={(e) => handleFieldChange('gerejaAsalTujuan', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Alasan Kepindahan</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Pernikahan / Domisili Kerja Baru"
                            onChange={(e) => handleFieldChange('alasanPindah', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Catatan Tambahan untuk Majelis</label>
                      <textarea
                        rows={2}
                        placeholder="Contoh: Lampiran berkas sedang disiapkan..."
                        onChange={(e) => handleFieldChange('catatanTambahan', e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded px-4 py-2 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-gmit-blue outline-none resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-gmit-blue hover:bg-gmit-blue-deep text-white font-bold font-display tracking-widest uppercase rounded shadow transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Sedang Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Kirim Lembar Pengajuan</span>
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>
            
          </div>

          {/* Lookup & Status Check column - lg:4 */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Interactive Tracker */}
            <div className="bg-gradient-to-br from-gmit-blue to-gmit-blue-deep text-white p-6 rounded-xl shadow-md space-y-4">
              <div className="flex items-center space-x-2.5">
                <Search className="h-5 w-5 text-gmit-gold" />
                <h3 className="font-display font-bold text-lg text-white">Cek Status Pengajuan</h3>
              </div>
              <p className="text-xs text-blue-100 font-light leading-relaxed">
                Punya nomor pendaftaran? Tempelkan kode unik Anda (Contoh: <code className="bg-white/10 px-1 py-0.5 rounded font-mono">reg_1715...</code>) di bawah untuk mengecek status verifikasi Majelis.
              </p>

              <form onSubmit={handleStatusSearch} className="flex space-x-2">
                <input
                  type="text"
                  required
                  placeholder="Ketik kode registrasi..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="bg-white/10 text-white placeholder-blue-200 border border-white/20 text-xs px-3 py-2 rounded flex-1 outline-none focus:bg-white/25 focus:ring-1 focus:ring-gmit-gold font-mono"
                />
                <button
                  type="submit"
                  className="bg-gmit-gold text-gmit-blue-deep hover:bg-gmit-gold/90 font-bold px-4 py-2 rounded text-xs transition font-display uppercase"
                >
                  Cari
                </button>
              </form>

              {hasSearched && (
                <div className="bg-white/5 border border-white/10 rounded p-4 text-xs space-y-2 mt-4">
                  {searchResult ? (
                    <>
                      <div className="flex justify-between border-b border-white/10 pb-1.5">
                        <span className="text-gray-300">Jenis:</span>
                        <span className="font-bold text-gmit-gold uppercase font-mono">{searchResult.type}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1.5">
                        <span className="text-gray-300">Pemohon:</span>
                        <span className="font-bold truncate max-w-[180px]">{searchResult.applicantName}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1.5">
                        <span className="text-gray-300">Tanggal:</span>
                        <span>{searchResult.dateSubmitted}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-gray-300">Status:</span>
                        <span className={`px-2 py-0.5 rounded font-bold uppercase font-mono text-[10px] ${
                          searchResult.status === 'Disetujui' ? 'bg-emerald-600 text-white' :
                          searchResult.status === 'Ditolak' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                        }`}>
                          {searchResult.status}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-red-200 italic font-light text-center">
                      Kode registrasi tidak ditemukan atau salah ketik.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Locally Saved Submissions */}
            <div className="bg-white border border-gray-150 rounded-xl p-5 space-y-4 shadow-sm">
              <h3 className="font-display font-bold text-sm text-gmit-blue-deep uppercase tracking-wider flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-gmit-gold" />
                <span>Pengajuan Saya</span>
              </h3>

              {localSavedApps.length > 0 ? (
                <div className="space-y-3">
                  {localSavedApps.map((item) => (
                    <div key={item.id} className="text-xs border border-gray-100 p-3 rounded bg-slate-50 relative">
                      <div className="font-bold text-gmit-blue-deep font-display uppercase tracking-wider">{item.type} • {item.applicantName}</div>
                      <div className="text-slate-450 font-mono text-[10px] mt-0.5">ID: {item.id}</div>
                      
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <span className="text-[10px] text-gray-400">Status:</span>
                        <span className={`px-1.5 py-0.5 rounded font-extrabold text-[9px] uppercase ${
                          item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={loadLocals}
                    className="w-full text-center text-xs text-gmit-gold font-bold hover:underline flex items-center justify-center space-x-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Perbarui Status</span>
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-light leading-relaxed">
                  Belum ada pengajuan beruntun Anda yang terekam di browser ini. Gunakan formulir di samping untuk mengirim pendaftaran baru.
                </div>
              )}
            </div>

            {/* 3. Alamat Sekretariat & FAQ */}
            <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-5 space-y-3">
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4 text-gmit-gold" />
                <h4 className="font-display font-bold text-xs text-gmit-gold-dark uppercase tracking-wider">Persyaratan Dokumen Fisik</h4>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc list-inside">
                <li><strong>Baptis:</strong> Akta Nikah Orang Tua, Akta Lahir Anak.</li>
                <li><strong>Sidi:</strong> Surat Baptis, Fotokopi Kartu Keluarga.</li>
                <li><strong>Nikah:</strong> Surat Katekisasi Sidi (keduanya), Surat Keterangan Kematian (jika ada janda/duda).</li>
                <li>Bawa seluruh dokumen asli ke Sekretariat Gereja pada hari kerja.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
