import { useState } from 'react';
import { motion } from 'motion/react';
import { Image, Video, ZoomIn, Eye, Film, Sparkles } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaGalleryProps {
  gallery: MediaItem[];
}

export default function MediaGallery({ gallery }: MediaGalleryProps) {
  const [selectedFilter, setSelectedFilter] = useState<'semua' | 'foto' | 'video'>('semua');
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  const filteredMedia = gallery.filter((item) => {
    if (selectedFilter === 'foto') return item.type === 'foto';
    if (selectedFilter === 'video') return item.type === 'video';
    return true;
  });

  return (
    <div className="bg-church-bg py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-gmit-gold font-bold tracking-widest text-xs uppercase font-mono block">Dokumentasi Pelayanan Jemaat</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-gmit-blue-deep tracking-tight">
            GALERI FOTO & VIDEO DOKUMENTASI
          </h2>
          <div className="h-1 w-20 bg-gmit-gold mx-auto rounded-full"></div>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Menyimak rekam sejarah peribadatan, ibadah syukur kategorial, aksi diakonia, serta kehangatan persekutuan keluarga besar GMIT Getsemani Mere.
          </p>
        </div>

        {/* Media Buttons Toggler */}
        <div className="flex justify-center space-x-2.5">
          <button
            onClick={() => setSelectedFilter('semua')}
            className={`px-4 py-2 text-xs font-bold rounded-lg border font-display uppercase tracking-widest transition-all ${
              selectedFilter === 'semua'
                ? 'bg-gmit-blue text-white border-gmit-blue'
                : 'bg-white text-slate-600 border-gray-250 hover:border-gmit-blue hover:text-gmit-blue'
            }`}
          >
            Semua Media
          </button>
          <button
            onClick={() => setSelectedFilter('foto')}
            className={`px-4 py-2 text-xs font-bold rounded-lg border font-display uppercase tracking-widest transition-all flex items-center space-x-2 ${
              selectedFilter === 'foto'
                ? 'bg-gmit-blue text-white border-gmit-blue'
                : 'bg-white text-slate-600 border-gray-250 hover:border-gmit-blue hover:text-gmit-blue'
            }`}
          >
            <Image className="h-3.5 w-3.5" />
            <span>Foto Jemaat</span>
          </button>
          <button
            onClick={() => setSelectedFilter('video')}
            className={`px-4 py-2 text-xs font-bold rounded-lg border font-display uppercase tracking-widest transition-all flex items-center space-x-2 ${
              selectedFilter === 'video'
                ? 'bg-gmit-blue text-white border-gmit-blue'
                : 'bg-white text-slate-600 border-gray-250 hover:border-gmit-blue hover:text-gmit-blue'
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span>Video Kegiatan</span>
          </button>
        </div>

        {/* Media Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.length > 0 ? (
            filteredMedia.map((item, idx) => {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer"
                  onClick={() => setLightboxItem(item)}
                >
                  {/* Media Image container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/800/600`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gmit-blue-deep/30 group-hover:bg-gmit-blue-deep/65 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full text-white ring-2 ring-white/40">
                        {item.type === 'video' ? (
                          <Film className="h-6 w-6 text-gmit-gold animate-pulse" />
                        ) : (
                          <Eye className="h-6 w-6 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Top category label */}
                    <span className="absolute top-3 left-3 bg-gmit-blue-deep/80 backdrop-blur-md text-white border border-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                      {item.type === 'video' ? <Video className="h-2.5 w-2.5 text-gmit-gold" /> : <Image className="h-2.5 w-2.5" />}
                      <span>{item.type}</span>
                    </span>
                  </div>

                  {/* Content description */}
                  <div className="p-4 space-y-1.5 text-left">
                    <h4 className="font-display font-bold text-base text-gmit-blue-deep group-hover:text-gmit-gold transition-colors leading-snug">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-slate-505 text-gray-400 font-light truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 py-16 text-center text-gray-400 text-sm">
              Belum ada foto atau video dokumentasi yang ditambahkan dalam kategori ini.
            </div>
          )}
        </div>

        {/* Modal lightbox overlay */}
        {lightboxItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-6 select-none animate-fade-in">
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 text-white hover:text-gmit-gold p-2 backdrop-blur hover:bg-white/10 rounded-full"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="max-w-4xl w-full h-full flex flex-col justify-center space-y-4">
              <div className="relative flex-1 max-h-[75vh] min-h-[300px] overflow-hidden rounded-lg flex items-center justify-center">
                {/* Visual file display */}
                {lightboxItem.type === 'video' ? (
                  <div className="w-full h-full max-w-2xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <Film className="h-16 w-16 text-gmit-gold" />
                    <h3 className="text-white font-display font-bold text-xl">{lightboxItem.title}</h3>
                    <p className="text-sm text-gray-300">Video streaming saat ini di-hosting di platform sosial media GMIT Getsemani Mere.</p>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-gmit-gold text-gmit-blue-deep font-bold font-display rounded shadow hover:bg-gmit-gold/90 text-xs uppercase"
                    >
                      Putar di YouTube / Facebook
                    </a>
                  </div>
                ) : (
                  <img
                    src={lightboxItem.imageUrl}
                    alt={lightboxItem.title}
                    className="max-w-full max-h-full object-contain rounded"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${lightboxItem.id}/1200/900`;
                    }}
                  />
                )}
              </div>

              <div className="text-left text-white px-2 space-y-1 max-w-2xl mx-auto">
                <span className="text-[10px] font-bold text-gmit-gold uppercase tracking-wider font-mono">
                  Dokumentasi {lightboxItem.type}
                </span>
                <h3 className="font-display font-bold text-lg md:text-xl text-white">
                  {lightboxItem.title}
                </h3>
                {lightboxItem.description && (
                  <p className="text-xs md:text-sm text-gray-300 font-light font-sans max-h-16 overflow-y-auto">
                    {lightboxItem.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
