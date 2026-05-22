import { Compass, Mail, Phone, MapPin, Landmark, Facebook, Youtube, Share2, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  return (
    <footer className="bg-slate-900 border-t-4 border-gmit-gold text-slate-300">
      
      {/* Outer links layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Col 1 - Church Brief */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="flex items-center space-x-3 text-white">
              <div className="bg-gmit-gold p-2 rounded-full text-slate-900 flex items-center justify-center">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display font-black text-base tracking-wide block leading-none text-white">
                  GMIT GETSEMANI MERE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#ca902a] block mt-0.5">
                  KEC. AMARASI BARAT • NTT
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Gereja Masehi Injili di Timor (GMIT) Jemaat Getsemani Mere terus terpanggil menghadirkan kasih Kristus, kemandirian teologi, kemakmuran jemaat, serta kedamaian rukun di tanah Timor, Provinsi Nusa Tenggara Timur.
            </p>

            {/* Social Medias icons */}
            <div className="flex items-center space-x-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-slate-850 hover:bg-gmit-gold p-2.5 rounded-full text-white hover:text-slate-900 transition-all border border-slate-800">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-slate-850 hover:bg-gmit-gold p-2.5 rounded-full text-white hover:text-slate-900 transition-all border border-slate-800">
                <Youtube className="h-4 w-4" />
              </a>
              <button onClick={() => setCurrentTab('galeri')} className="bg-slate-850 hover:bg-gmit-gold p-2.5 rounded-full text-white hover:text-slate-900 transition-all border border-slate-800">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Col 2 - Menus */}
          <div className="md:col-span-3 space-y-3.5 text-left">
            <h4 className="font-display font-bold text-sm text-gmit-gold uppercase tracking-widest">Akses Cepat</h4>
            <ul className="text-xs space-y-2.5 font-light">
              <li>
                <button onClick={() => setCurrentTab('beranda')} className="hover:text-gmit-gold transition">
                  Halaman Beranda
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('profil')} className="hover:text-gmit-gold transition">
                  Profil Visi Misi & Majelis
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('kegiatan')} className="hover:text-gmit-gold transition">
                  Jadwal Ibadah & Kas Keuangan
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('pengajuan')} className="hover:text-gmit-gold transition">
                  Pendaftaran Baptis, Sidi & Nikah
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('galeri')} className="hover:text-gmit-gold transition">
                  Dokumentasi Galeri Media
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 - Contacts */}
          <div id="kontak-section" className="md:col-span-5 space-y-3.5 text-left">
            <h4 className="font-display font-bold text-sm text-gmit-gold uppercase tracking-widest">Hubungi Kami (Sekretariat)</h4>
            
            <div className="text-xs space-y-3 font-light text-slate-350">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gmit-gold mr-3 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-400">
                  Mere, Kecamatan Amarasi Barat, <br />
                  Kabupaten Kupang, Provinsi Nusa Tenggara Timur, Indonesia
                </span>
              </div>

              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gmit-gold mr-3 flex-shrink-0" />
                <a href="tel:+6281339219988" className="hover:text-gmit-gold transition text-slate-400">
                  +62 8......... (Humas Majelis)
                </a>
              </div>

              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gmit-gold mr-3 flex-shrink-0" />
                <a href="mailto:gmitgetsemanimere@gmail.com" className="hover:text-gmit-gold transition text-slate-400">
                  gmitgetsemanimere@gmail.com
                </a>
              </div>
            </div>

            {/* Infinityfree notice */}
            <div className="bg-slate-950 p-3 rounded border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center space-x-2">
              <Compass className="h-3.5 w-3.5 text-gmit-gold" />
              <span>Dihosting resmi di domain GMIT Getsemani Mer</span>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTNOTE COPYRIGHTS BAR */}
      <div className="bg-slate-950 border-t border-slate-805 py-6 text-center text-xs text-slate-505 select-none text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-left">
            Copyright &copy; {new Date().getFullYear()} GMIT Getsemani Mere_design by 41273. All Rights Reserved.
          </p>
          <p className="text-right text-[10px] flex items-center text-slate-600">
            <span>Soli Deo Gloria</span>
            <Heart className="h-2.5 w-2.5 text-gmit-gold fill-gmit-gold mx-1 animate-pulse" />
            <span>Kec. Amarasi Barat, Kab. Kupang, NTT, Indonesia</span>
          </p>
        </div>
      </div>

    </footer>
  );
}
