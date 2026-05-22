import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Landmark, Heart, ShieldAlert, Phone, Mail, Award, MapPin } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Profil from './components/Profil';
import Kegiatan from './components/Kegiatan';
import Registrations from './components/Registrations';
import MediaGallery from './components/MediaGallery';
import AICorner from './components/AICorner';
import RunningText from './components/RunningText';
import Footer from './components/Footer';
import AdminPortal from './components/AdminPortal';
import { ChurchData, ChurchRegistration } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('beranda');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Dynamic State matching the Church schema
  const [churchData, setChurchData] = useState<ChurchData>({
    visimisi: { visi: '', misi: [], motto: '' },
    majelis: [],
    activities: [],
    announcements: [],
    financials: [],
    registrations: [],
    gallery: []
  });

  // Fetch all church resources
  const fetchChurchData = async () => {
    try {
      const savedData = localStorage.getItem('gmit_church_data');
      if (savedData) {
        setChurchData(JSON.parse(savedData));
      } else {
        // Fetch static local church_data.json from public folder
        const res = await fetch('/church_data.json');
        if (res.ok) {
          const json = await res.json();
          setChurchData(json);
          localStorage.setItem('gmit_church_data', JSON.stringify(json));
        }
      }
    } catch (err) {
      console.error('Failed to load church data from local static json:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChurchData();
    // Validate local login session
    const token = localStorage.getItem('gmit_session');
    if (token === 'session_token_getsemani_mere') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('gmit_session', token);
    setIsAdminLoggedIn(true);
    setCurrentTab('admin'); // Navigate to dashboard directly on success
  };

  const handleLogout = () => {
    localStorage.removeItem('gmit_session');
    setIsAdminLoggedIn(false);
    setCurrentTab('beranda');
  };

  // Submission handler for registrations
  const handleRegisterSubmit = async (regData: any): Promise<ChurchRegistration | null> => {
    try {
      const currentRaw = localStorage.getItem('gmit_church_data');
      let currentData: ChurchData;
      if (currentRaw) {
        currentData = JSON.parse(currentRaw);
      } else {
        currentData = churchData;
      }

      const newReg: ChurchRegistration = {
        id: 'reg_' + Date.now(),
        type: regData.type,
        applicantName: regData.applicantName,
        phone: regData.phone,
        email: regData.email || '',
        dateSubmitted: new Date().toISOString().split('T')[0],
        status: 'Pending',
        formData: regData.formData || {}
      };

      const updatedData: ChurchData = {
        ...currentData,
        registrations: [newReg, ...currentData.registrations]
      };

      localStorage.setItem('gmit_church_data', JSON.stringify(updatedData));
      setChurchData(updatedData);
      return newReg;
    } catch (error) {
      console.error('Registration failed client-side:', error);
    }
    return null;
  };

  // Helper navigating to admin directly
  const handleNavigateToAdmin = () => {
    setCurrentTab('admin');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4 text-white p-4">
        <div className="h-16 w-16 border-4 border-gmit-gold border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="font-display font-black tracking-widest text-lg text-gmit-gold uppercase">GMIT GETSEMANI MERE</h3>
          <p className="text-xs text-gray-300 italic mt-1 font-sans">Mempersiapkan beranda persekutuan kudus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-church-bg flex flex-col justify-between">
      
      {/* 1. Header Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
      />

      {/* 2. Main Dynamic Page Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* BERANDA - HOME VIEW */}
            {currentTab === 'beranda' && (
              <div className="space-y-4">
                <Hero 
                  setCurrentTab={setCurrentTab} 
                  motto={churchData.visimisi.motto} 
                />

                {/* Welcome Card & Brief Profil Snippet */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
                  
                  <div className="lg:col-span-7 space-y-4">
                    <span className="text-gmit-gold font-bold tracking-widest text-xs uppercase font-mono block">Sambutan Ketua Majelis</span>
                    <h2 className="font-display font-extrabold text-2xl md:text-3.5xl text-gmit-blue-deep tracking-tight">
                      Syalom, Selamat Datang di GMIT Getsemani Mere!
                    </h2>
                    
                    <p className="text-sm text-gray-650 text-slate-700 leading-relaxed font-light">
                      Salam sejahtera dalam Yesus Kristus Kepala Gereja! Website ini dirancang sebagai pelita informasi dan administrasi digital bagi segenap Jemaat Getsemani Mere, Kec. Amarasi Barat. Dalam kebersamaan teologis GMIT, kami rukun melayani lewat persekutuan, kesaksian, dan pelayanan kasih.
                    </p>
                    <p className="text-sm text-gray-650 text-slate-700 leading-relaxed font-light font-sans font-medium">
                      Melalui portal mandiri ini, bapak, ibu, serta seluruh pemuda-pemudi dapat mendaftarkan baptisan keluarga, memverifikasi katekisan Sidi, menyimak laporan transparansi kas warta jemaat, atau merangkum khotbah lewat rubrik AI Corner. Selamat melayani, sehati bersemi!
                    </p>

                    <div className="pt-2">
                      <span className="font-display font-extrabold text-slate-800 text-base block">Pdt. Maria Martha Boesday, S.Th</span>
                      <span className="text-xs text-gmit-gold font-bold uppercase tracking-wider block">Ketua Majelis Jemaat Harian Getsemani Mere</span>
                    </div>
                  </div>

                  {/* Right Column - Brief Synod / Church stats */}
                  <div className="lg:col-span-5 bg-white border border-gray-150 p-6 rounded-xl shadow space-y-5">
                    <h3 className="font-display font-bold text-sm text-gmit-blue-deep uppercase tracking-widest border-b pb-3 flex items-center space-x-2">
                      <Award className="h-4 w-4 text-gmit-gold" />
                      <span>Ringkasan Statistik Pelayanan</span>
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gmit-gold-light/40 border border-gmit-gold/10 p-4 rounded text-center">
                        <span className="text-3xl font-black font-display text-gmit-gold-dark block">2</span>
                        <span className="text-[10px] uppercase font-bold text-slate-650 text-slate-500 block">Rayon Pelayanan</span>
                      </div>
                      <div className="bg-gmit-blue-light/50 border border-gmit-blue/10 p-4 rounded text-center">
                        <span className="text-3xl font-black font-display text-gmit-blue block">5</span>
                        <span className="text-[10px] uppercase font-bold text-slate-550 text-slate-500 block">Kelompok Kategorial</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded text-center col-span-2">
                        <span className="text-2xl font-black font-display text-gmit-blue-deep block">776+</span>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Anggota Jemaat Terdaftar</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Interactive AI Corner Preview Embedded on Home */}
                <AICorner />

                {/* Quick Events Snippet */}
                <Kegiatan 
                  activities={churchData.activities.slice(0, 3)} 
                  announcements={churchData.announcements.slice(0, 2)} 
                  financials={churchData.financials.slice(0, 2)} 
                />
              </div>
            )}

            {/* PROFIL VIEW */}
            {currentTab === 'profil' && (
              <Profil
                visimisi={churchData.visimisi}
                majelis={churchData.majelis}
                onNavigateToAdmin={handleNavigateToAdmin}
              />
            )}

            {/* KEGIATAN & WARTA VIEW */}
            {currentTab === 'kegiatan' && (
              <Kegiatan
                activities={churchData.activities}
                announcements={churchData.announcements}
                financials={churchData.financials}
              />
            )}

            {/* PENGAJUAN ADMINISTRASI VIEW */}
            {currentTab === 'pengajuan' && (
              <Registrations
                onRegisterSubmit={handleRegisterSubmit}
                registrations={churchData.registrations}
              />
            )}

            {/* MEDIA GALLERY VIEW */}
            {currentTab === 'galeri' && (
              <MediaGallery gallery={churchData.gallery} />
            )}

            {/* HUBUNGI KAMI / CONTACTS ANCHOR */}
            {currentTab === 'kontak' && (
              <div className="bg-church-bg py-16 text-left">
                <div className="max-w-4xl mx-auto px-4 space-y-8 bg-white p-8 md:p-12 border rounded-xl shadow-md">
                  <div className="text-center space-y-2 pb-4 border-b">
                    <span className="text-gmit-gold font-mono uppercase text-xs tracking-widest font-bold">Respon Pelayanan Kristen</span>
                    <h2 className="font-display font-extrabold text-3xl text-gmit-blue-deep">Hubungi Sekretariat Umum</h2>
                    <p className="text-xs text-slate-505">Pintu pelayanan Getsemani Mere terbuka 24 jam bagi jemaat yang membutuhkan bantuan doa atau pastoral.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                      <h3 className="font-display font-bold text-base text-gmit-blue">Lokasi & Jam Kerja</h3>
                      <div className="flex items-start text-xs text-slate-700 leading-relaxed">
                        <MapPin className="h-4.5 w-4.5 text-gmit-gold mr-3 flex-shrink-0 mt-0.5" />
                        <span>Mere, Kelurahan Amarasi Barat, Kabupaten Kupang, NTT. Jam Pelayanan: Senin - Jumat (08:00 - 15:00 WITA).</span>
                      </div>
                      <div className="flex items-start text-xs text-slate-700 leading-relaxed">
                        <Phone className="h-4.5 w-4.5 text-gmit-gold mr-3 flex-shrink-0 mt-0.5" />
                        <span>Ketua Majelis Harian: +62 813-3921-9988</span>
                      </div>
                      <div className="flex items-start text-xs text-slate-700 leading-relaxed">
                        <Mail className="h-4.5 w-4.5 text-gmit-gold mr-3 flex-shrink-0 mt-0.5" />
                        <span>Kirim Surel Pelayanan: info@getsemanimere.gmit.or.id</span>
                      </div>
                    </div>

                    <div className="bg-gmit-gold-light/40 border border-gmit-gold/25 p-5 rounded-lg space-y-3">
                      <h3 className="font-display font-bold text-sm text-gmit-gold-dark uppercase tracking-wider">Konseling & Pertolongan Doa</h3>
                      <p className="text-xs text-slate-700 leading-normal">
                        Bila bapak, ibu, atau keluarga terkasih sedang mengalami perbebanan raga, sakit, atau duka cita, mohon layangkan permohonan kunjungan atau perkunjungan rumah sakit melalui nomor WhatsApp Ketua Majelis Harian di atas.
                      </p>
                      <div className="text-[10px] text-slate-500 font-mono">*Pelayanan Sakramen Perjamuan Kudus Orang Sakit diberikan atas koordinasi Pendeta Pelayan.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN PORTAL PANEL */}
            {currentTab === 'admin' && (
              <AdminPortal
                churchData={churchData}
                onRefreshData={fetchChurchData}
                isAdminLoggedIn={isAdminLoggedIn}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Running Activities ticker right above footer */}
      <RunningText activities={churchData.activities} />

      {/* 4. Footer widget containing credits and metadata */}
      <Footer setCurrentTab={setCurrentTab} />

    </div>
  );
}
