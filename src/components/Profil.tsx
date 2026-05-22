import { motion } from 'motion/react';
import { ShieldCheck, Mail, Phone, Users2, Compass } from 'lucide-react';
import { ChurchData, MajelisMember } from '../types';

interface ProfilProps {
  visimisi: ChurchData['visimisi'];
  majelis: MajelisMember[];
  onNavigateToAdmin: () => void;
}

export default function Profil({ visimisi, majelis, onNavigateToAdmin }: ProfilProps) {
  // Helphul avatar color map
  const getAvatarColor = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('ketua')) return 'bg-gmit-blue text-white ring-2 ring-gmit-gold';
    if (roleLower.includes('sekretaris')) return 'bg-gmit-gold text-gmit-blue-deep font-semibold';
    if (roleLower.includes('bendahara')) return 'bg-emerald-700 text-white';
    return 'bg-slate-200 text-slate-700';
  };

  const getInitials = (name: string) => {
    const cleanName = name.replace(/(Pdt\.|Pnt\.|Dkn\.)/g, '').trim();
    const parts = cleanName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };

  return (
    <div className="bg-church-bg py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-gmit-gold font-bold tracking-widest text-xs uppercase font-mono block">Mengenal Lebih Dekat</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-gmit-blue-deep tracking-tight">
            PROFIL GMIT GETSEMANI MERE
          </h2>
          <div className="h-1 w-20 bg-gmit-gold mx-auto rounded-full"></div>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Sejarah pelayanan, visi teologis, dan barisan presbiter Majelis Jemaat Harian yang berkomitmen melayani jemaat di Kec. Amarasi Barat dengan penuh ketulusan kasih Kristus.
          </p>
        </div>

        {/* Visi, Misi and Motto Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Visi */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gmit-blue">
                <div className="bg-gmit-blue/10 p-2.5 rounded-full">
                  <Compass className="h-6 w-6 stroke-[2]" />
                </div>
                <h3 className="font-display font-bold text-xl text-gmit-blue-deep">VISI JEMAAT</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed font-normal italic">
                &ldquo;{visimisi.visi}&rdquo;
              </p>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <span className="text-xs uppercase text-gmit-gold tracking-widest font-mono font-semibold block">Motto Kebanggaan</span>
              <span className="text-lg font-bold font-display text-gmit-blue-deep block mt-1">
                {visimisi.motto}
              </span>
            </div>
          </motion.div>

          {/* Misi */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gmit-blue-deep text-white rounded-xl shadow-lg p-8 space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gmit-gold/20 p-2.5 rounded-full text-gmit-gold">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-gmit-gold">MISI JEMAAT</h3>
            </div>

            <ul className="space-y-4 text-sm md:text-base text-gray-200">
              {visimisi.misi.map((val, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="flex-shrink-0 bg-gmit-gold/20 text-gmit-gold font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-1 font-mono">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{val}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Struktur Organisasi Majelis Harian */}
        <div id="majelis-section" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center space-x-2 text-gmit-gold">
                <Users2 className="h-5 w-5" />
                <span className="text-xs font-semibold tracking-widest uppercase">Pelayan Khusus</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-gmit-blue-deep tracking-tight mt-1">
                Struktur Majelis Jemaat Harian (MJH)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-2 md:mt-0 font-mono italic max-w-sm sm:max-w-md text-left md:text-right">
              *Data penatua/diaken, foto identitas lengkap, dan rincian kontak dapat ditambahkan dan diupdate berkala di portal Admin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {majelis.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6 flex items-start space-x-4">
                  {/* Photo or Initials Icon */}
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-gmit-gold/40 border flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold font-display flex-shrink-0 shadow-inner ${getAvatarColor(member.role)}`}>
                      {getInitials(member.name)}
                    </div>
                  )}

                  {/* Member Details */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <span className="inline-block bg-gmit-gold-light text-gmit-gold-dark text-[11px] font-bold tracking-wider px-2 py-0.5 rounded uppercase leading-none border border-gmit-gold/15">
                      {member.role}
                    </span>
                    <h4 className="font-display font-bold text-base text-gmit-blue-deep leading-tight truncate">
                      {member.name}
                    </h4>

                    {/* Contact details */}
                    {(member.phone || member.email) ? (
                      <div className="pt-2 border-t border-gray-100 flex flex-col space-y-1 text-slate-500 text-xs">
                        {member.phone && (
                          <a href={`tel:${member.phone}`} className="flex items-center hover:text-gmit-gold">
                            <Phone className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{member.phone}</span>
                          </a>
                        )}
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="flex items-center hover:text-gmit-gold">
                            <Mail className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="pt-2 text-[11px] text-gray-400 italic">
                        Hubungi via sekretariat umum gereja Mere
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Admin reminder widget */}
          <div className="bg-gmit-gold-light rounded-xl border border-gmit-gold/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="font-display font-bold text-gmit-blue-deep text-lg">Anda Admin Gereja?</h4>
              <p className="text-sm text-slate-600 mt-1">Gunakan panel admin untuk merubah, menghapus, atau mengganti identitas serta nomor WhatsApp pimpinan pelayanan di atas.</p>
            </div>
            <button
              onClick={onNavigateToAdmin}
              className="bg-gmit-blue hover:bg-gmit-blue-deep text-white text-sm font-bold font-display px-5 py-2.5 rounded shadow transition-all whitespace-nowrap uppercase"
            >
              Ubah Data Majelis
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
