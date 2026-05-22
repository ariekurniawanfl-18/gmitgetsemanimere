import { motion } from 'motion/react';
import { Calendar, Users, FileText, ChevronRight, BookOpen } from 'lucide-react';

interface HeroProps {
  setCurrentTab: (tab: string) => void;
  motto: string;
}

export default function Hero({ setCurrentTab, motto }: HeroProps) {
  // exact generated path
  const heroImgUrl = "/src/assets/images/hero_church_1779340394201.png";

  return (
    <section className="relative bg-gmit-blue-deep text-white overflow-hidden min-h-[520px] lg:min-h-[640px] flex items-center">
      {/* Background Image with elegant overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImgUrl}
          fallback-src="https://picsum.photos/seed/churchgmit/1920/1080?blur=1"
          alt="GMIT Getsemani Mere"
          className="w-full h-full object-cover object-center scale-105 filter brightness-45 contrast-110"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // fallback if local build file path needs fallback in some clients
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/getsemanichurch/1600/900";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gmit-blue-deep via-gmit-blue-deep/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gmit-blue-deep/90 via-transparent to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-gmit-gold/20 border border-gmit-gold/40 text-gmit-gold px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            >
              <span className="h-2 w-2 rounded-full bg-gmit-gold animate-ping"></span>
              <span>Shalom • Selamat Datang</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight"
            >
              GMIT GETSEMANI MERE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gmit-gold to-yellow-400">
                KEC. AMARASI BARAT
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-gray-200 text-base md:text-lg max-w-2xl leading-relaxed italic border-l-4 border-gmit-gold pl-4"
            >
              &ldquo;Lakukan keadilan, cintai kesetiaan, dan hidup rendah hati di hadapan Allah.&rdquo;
              <span className="block not-italic text-gmit-gold font-bold text-sm tracking-widest mt-2 uppercase">
                —— Tema Pelayanan (Mikha 6:8)
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-gray-300 text-sm md:text-base max-w-xl font-light"
            >
              Persekutuan jemaat yang diberkati di wilayah Klasis Amarasi Barat, 
              berkomitmen mewujudkan damai sejahtera Kristus melalui teologi yang mandiri, 
              pelayanan kasih sejati, serta kepedulian inklusif sesama anggota jemaat.
            </motion.p>

            {/* Motto block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg max-w-md"
            >
              <div className="text-xs uppercase text-gmit-gold tracking-widest font-mono font-semibold">Motto Kebanggaan Jemaat:</div>
              <div className="text-base font-medium text-white italic mt-1 font-display">
                &ldquo;{motto || "Getsemani Bersemi: Bersyukur, Sehati, Melayani"}&rdquo;
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <button
                onClick={() => setCurrentTab('profil')}
                className="px-6 py-3 bg-gmit-gold hover:bg-gmit-gold/90 text-gmit-blue-deep font-bold font-display rounded shadow-lg hover:shadow-xl transition-all duration-150 flex items-center space-x-2 text-sm uppercase"
              >
                <span>Profil Majelis</span>
                <ChevronRight className="h-4 w-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => setCurrentTab('kegiatan')}
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold font-display rounded border border-white/30 hover:border-white/50 transition-all text-sm uppercase flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Jadwal Ibadah</span>
              </button>
            </motion.div>
          </div>

          {/* Quick Info Grid Widgets */}
          <div className="lg:col-span-4 grid grid-cols-1 gap-4">
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gmit-blue-deep/80 border border-gmit-gold/30 p-5 rounded-lg flex items-start space-x-4 shadow-xl hover:bg-gmit-blue-deep/95 transition-all cursor-pointer"
              onClick={() => setCurrentTab('pengajuan')}
            >
              <div className="bg-gmit-gold/20 p-3 rounded text-gmit-gold">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-gmit-gold tracking-tight">Pelayanan Administrasi Jemaat</h3>
                <p className="text-xs text-gray-300 mt-1">Daftar baptisan, peneguhan sidi, nikah kudus, atau surat atestasi secara online dan praktis.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gmit-blue-deep/80 border border-gmit-gold/30 p-5 rounded-lg flex items-start space-x-4 shadow-xl hover:bg-gmit-blue-deep/95 transition-all cursor-pointer"
              onClick={() => {
                const aiEl = document.getElementById('ai-corner-widget');
                if (aiEl) {
                  aiEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setCurrentTab('beranda');
                  setTimeout(() => {
                    document.getElementById('ai-corner-widget')?.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                }
              }}
            >
              <div className="bg-gmit-gold/20 p-3 rounded text-gmit-gold">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-gmit-gold tracking-tight">AI Corner Pelayan Jemaat</h3>
                <p className="text-xs text-gray-300 mt-1">Gunakan asisten kecerdasan buatan Gemini untuk membuat rancangan warta, khotbah, atau bimbingan mingguan.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gmit-blue-deep/80 border border-gmit-gold/30 p-5 rounded-lg flex items-start space-x-4 shadow-xl hover:bg-gmit-blue-deep/95 transition-all cursor-pointer"
              onClick={() => setCurrentTab('kegiatan')}
            >
              <div className="bg-gmit-gold/20 p-3 rounded text-gmit-gold">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-gmit-gold tracking-tight">Warta Jemaat & Keuangan</h3>
                <p className="text-xs text-gray-300 mt-1">Transparansi kas, warta keuangan mingguan, dan laporan donasi pembangunan gereja Mere.</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
