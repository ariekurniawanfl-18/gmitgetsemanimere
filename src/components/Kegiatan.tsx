import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CalendarRange, Bell, Landmark, TrendingUp, TrendingDown, Wallet, Clock, MapPin, Tag } from 'lucide-react';
import { ChurchActivity, AnnouncementItem, FinancialWarta } from '../types';

interface KegiatanProps {
  activities: ChurchActivity[];
  announcements: AnnouncementItem[];
  financials: FinancialWarta[];
}

export default function Kegiatan({ activities, announcements, financials }: KegiatanProps) {
  const [finFilter, setFinFilter] = useState<'semua' | 'pemasukan' | 'pengeluaran'>('semua');
  const [annCategory, setAnnCategory] = useState<'Semua' | 'Warta Jemaat' | 'Pengumuman' | 'Berita' | 'Kegiatan'>('Semua');

  // Filter warta keuangan
  const filteredFin = financials.filter(f => {
    if (finFilter === 'pemasukan') return f.category === 'Pemasukan';
    if (finFilter === 'pengeluaran') return f.category === 'Pengeluaran';
    return true;
  });

  // Calculate finance aggregates
  const totalPemasukan = financials
    .filter(f => f.category === 'Pemasukan')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPengeluaran = financials
    .filter(f => f.category === 'Pengeluaran')
    .reduce((sum, item) => sum + item.amount, 0);

  const saldoAkhir = totalPemasukan - totalPengeluaran;

  // Filter announcements
  const filteredAnnObj = announcements.filter(ann => {
    if (annCategory === 'Semua') return true;
    return ann.category === annCategory;
  });

  // Helper currency formatting in Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="bg-church-bg py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-gmit-gold font-bold tracking-widest text-xs uppercase font-mono block">Media Publikasi & Keuangan</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-gmit-blue-deep tracking-tight">
            KEGIATAN & WARTA KEUANGAN
          </h2>
          <div className="h-1 w-20 bg-gmit-gold mx-auto rounded-full"></div>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Ikuti berbagai persekutuan peribadatan rutin, pengumuman klasis mingguan, serta transparansi lengkap warta keuangan jemaat Getsemani Mere secara online.
          </p>
        </div>

        {/* 1. JADWAL IBADAH SEKSI */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 text-gmit-blue pb-3 border-b border-gray-200">
            <div className="bg-gmit-blue/10 p-2 rounded-lg">
              <CalendarRange className="h-6 w-6" />
            </div>
            <h3 className="font-display font-black text-2xl text-gmit-blue-deep uppercase tracking-tight">
              Jadwal Peribadatan Jemaat
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => (
              <motion.div
                key={act.id}
                whileHover={{ y: -3 }}
                className={`bg-white rounded-xl shadow border p-6 flex flex-col justify-between transition-all duration-200 ${
                  act.isRegularService 
                    ? 'border-l-4 border-l-gmit-blue border-gray-100' 
                    : 'border-l-4 border-l-gmit-gold border-gray-100'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      act.isRegularService 
                        ? 'bg-gmit-blue-light text-gmit-blue' 
                        : 'bg-gmit-gold-light text-gmit-gold-dark'
                    }`}>
                      {act.isRegularService ? 'Ibadah Utama GMIT' : 'Persiapan Kategorial'}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-lg text-gmit-blue-deep leading-snug">
                    {act.title}
                  </h4>

                  <div className="space-y-2 text-xs text-slate-600 font-medium">
                    <div className="flex items-center text-slate-700">
                      <Clock className="h-3.5 w-3.5 text-gmit-gold mr-2 flex-shrink-0" />
                      <span>{act.dateTime}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-gmit-gold mr-2 flex-shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>
                    {act.speaker && (
                      <div className="flex items-center text-slate-700">
                        <Tag className="h-3.5 w-3.5 text-gmit-gold mr-2 flex-shrink-0" />
                        <span>Pelayan: <strong className="text-gmit-blue-deep font-semibold">{act.speaker}</strong></span>
                      </div>
                    )}
                  </div>

                  {act.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed italic">
                      &ldquo;{act.description}&rdquo;
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. PENGUMUMAN & BERITA BLOG */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 text-gmit-blue pb-3 border-b border-gray-200">
            <div className="bg-gmit-blue/10 p-2 rounded-lg">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="font-display font-black text-2xl text-gmit-blue-deep uppercase tracking-tight">
              Warta & Pengumuman Jemaat
            </h3>
          </div>

          {/* Filtering Categories */}
          <div className="flex flex-wrap gap-2">
            {(['Semua', 'Warta Jemaat', 'Pengumuman', 'Berita', 'Kegiatan'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setAnnCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all ${
                  annCategory === cat
                    ? 'bg-gmit-blue text-white border-gmit-blue'
                    : 'bg-white text-slate-600 border-gray-200 hover:border-gmit-blue hover:text-gmit-blue'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAnnObj.length > 0 ? (
              filteredAnnObj.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase py-0.5 px-2.5 rounded bg-amber-50 text-gmit-gold border border-gmit-gold/20">
                        {ann.category}
                      </span>
                      <span className="text-xs text-gray-400 font-mono font-medium">
                        Disiarkan: {ann.date}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-lg text-gmit-blue-deep leading-tight">
                      {ann.title}
                    </h4>

                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line font-light">
                      {ann.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                Belum ada pengumuman dalam kategori ini.
              </div>
            )}
          </div>
        </div>

        {/* 3. WARTA KEUANGAN TRANSPARAN */}
        <div id="warta-keuangan-section" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-gray-200 gap-4">
            <div className="flex items-center space-x-3 text-gmit-blue">
              <div className="bg-gmit-blue/10 p-2 rounded-lg">
                <Landmark className="h-6 w-6" />
              </div>
              <h3 className="font-display font-black text-2xl text-gmit-blue-deep uppercase tracking-tight">
                Laporan Transparansi Keuangan
              </h3>
            </div>

            {/* In/Out Selector */}
            <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start">
              <button
                onClick={() => setFinFilter('semua')}
                className={`px-3 py-1 text-xs font-bold roundedTransition font-display ${
                  finFilter === 'semua' ? 'bg-white text-gmit-blue shadow-sm' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Semua Arus
              </button>
              <button
                onClick={() => setFinFilter('pemasukan')}
                className={`px-3 py-1 text-xs font-bold roundedTransition font-display ${
                  finFilter === 'pemasukan' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setFinFilter('pengeluaran')}
                className={`px-3 py-1 text-xs font-bold roundedTransition font-display ${
                  finFilter === 'pengeluaran' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-red-600'
                }`}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          {/* Quick Balance Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-center space-x-4">
              <div className="bg-emerald-250 p-3 rounded-full text-emerald-800">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest font-mono block">TOTAL PEMASUKAN</span>
                <span className="text-xl font-bold font-display text-emerald-900 block mt-0.5">
                  {formatRupiah(totalPemasukan)}
                </span>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-center space-x-4">
              <div className="bg-red-200 p-3 rounded-full text-red-800">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-red-800 uppercase tracking-widest font-mono block">TOTAL PENGELUARAN</span>
                <span className="text-xl font-bold font-display text-red-900 block mt-0.5">
                  {formatRupiah(totalPengeluaran)}
                </span>
              </div>
            </div>

            <div className="bg-gmit-gold-light border border-gmit-gold/20 rounded-xl p-5 flex items-center space-x-4">
              <div className="bg-gmit-gold/20 p-3 rounded-full text-gmit-gold-dark">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gmit-gold-dark uppercase tracking-widest font-mono block">KAS / SALDO AKTIF</span>
                <span className={`text-xl font-bold font-display block mt-0.5 ${saldoAkhir >= 0 ? 'text-gmit-blue-deep' : 'text-red-600'}`}>
                  {formatRupiah(saldoAkhir)}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Transactions Table */}
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
                <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-xs border-b border-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-bold">Keterangan / Uraian Pos</th>
                    <th scope="col" className="px-6 py-4 font-bold text-center">Jenis</th>
                    <th scope="col" className="px-6 py-4 font-bold">Tanggal</th>
                    <th scope="col" className="px-6 py-4 font-bold text-right">Jumlah (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFin.length > 0 ? (
                    filteredFin.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800 leading-tight">{f.title}</div>
                          {f.description && <div className="text-xs text-gray-400 mt-1">{f.description}</div>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase leading-none ${
                            f.category === 'Pemasukan' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {f.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono font-medium text-slate-500">
                          {f.date}
                        </td>
                        <td className={`px-6 py-4 text-right font-display font-extrabold text-sm ${
                          f.category === 'Pemasukan' ? 'text-emerald-700' : 'text-red-700'
                        }`}>
                          {f.category === 'Pemasukan' ? '+' : '-'} {formatRupiah(f.amount).replace('Rp', '').trim()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-450 text-sm">
                        Belum ada warta catatan transaksi keuangan yang terekam.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
