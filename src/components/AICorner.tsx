import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, BookOpen, Presentation, Calendar, HelpCircle, Send, RefreshCw, Copy, Check } from 'lucide-react';

export default function AICorner() {
  const [activeTip, setActiveTip] = useState<'khotbah' | 'warta' | 'pemuda'>('khotbah');
  const [promptText, setPromptText] = useState(
    "Buatkan outline draf khotbah ibadah kategorial pemuda kreatif dengan Nas pembimbing Surat Roma 12:1-2 tentang persembahan diri yang hidup. Tuliskan dalam 3 poin perenungan ringkas beserta contoh nyata kehidupan anak muda di desa."
  );
  const [modelType, setModelType] = useState<'khotbah' | 'warta' | 'umum'>('khotbah');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tutorial templates / pre-made prompt guidelines
  const aiTips = {
    khotbah: {
      title: "Penyusunan Outline Khotbah Kreatif",
      aiChoice: "Gemini / AI Studio / ChatGPT",
      promptTemplate: "Tuliskan 3 paragraf draf khotbah Kristen kreatif teologis berdasarkan Nas Alkitab [Cantumkan Kitab Ayat] bertajuk tema [Ketik Tema]. Sediakan ilustrasi pembuka relevan dengan kehidupan pertanian atau gotong royong, serta 1 pertanyaan reflektif penutup.",
      steps: [
        "Tentukan teks Alkitab (Nas Pembimbing) yang telah disepakati di rapat Konsistori.",
        "Salin pola draf perintah prompt di bawah ini ke kotak Chat AI.",
        "Gunakan model AI Google AI Studio (gemini-3.5-flash) secara gratis untuk mengolah bahasa agar mendalam namun mudah dipahami jemaat.",
        "Periksa relevansi doktrinal hasil khotbah sebelum dipresentasikan di mimbar."
      ]
    },
    warta: {
      title: "Merangkum Warta Jemaat & Berita",
      aiChoice: "DeepSeek / Gemini / Copilot",
      promptTemplate: "Saya adalah sekretaris gereja. Tolong rapikan catatan acak kegiatan pelayanan jemaat berikut menjadi bentuk poin-poin pengumuman warta jemaat yang ringkas, ramah, dan tertata rapi diletakkan di lembar buletin gereja minggu ini: [Salin Catatan Acak Di Sini]",
      steps: [
        "Kumpulkan catatan mentah dari setiap Rayon, UPP pemuda, ibu, dan bapak.",
        "Gunakan perintah prompt di bawah untuk memadatkan berita jemaat agar muat dalam 1 halaman buletin selebaran fisik.",
        "Pastikan tanggal serta nominal uang (jika ada persembahan khusus) terdaftar dengan akurat.",
        "Tambahkan imbuhan kalimat salam pembuka ('Syalom bapak/ibu terkasih') secara otomatis."
      ]
    },
    pemuda: {
      title: "Desain Materi Presentasi Pelayanan Pemuda",
      aiChoice: "Copilot / ChatGPT / Slides AI",
      promptTemplate: "Buatkan rancangan outline draf isi slide presentasi PowerPoint sebanyak 5 slide untuk ibadah persekutuan pemuda. Temanya adalah 'Pentingnya Integritas Digital'. Sediakan slide judul, ilustrasi krisis akhlak medsos, ayat dasar Amsal, rencana aksi nyata, dan slide penutup.",
      steps: [
        "Pilih tema kepemudaan Kristen atau integritas hidup modern.",
        "Perintahkan asisten teologis AI untuk menyusun kerangka slide bernomor urut.",
        "Minta asisten menyertakan saran visual, warna kontras dominan slide, dan kata kunci tebal di masing-masing slide.",
        "Salin teks yang dihasilkan langsung ke aplikasi PowerPoint atau Google Slides."
      ]
    }
  };

  const handleApplyTemplate = (type: 'khotbah' | 'warta' | 'pemuda') => {
    setModelType(type === 'pemuda' ? 'umum' : type);
    if (type === 'khotbah') {
      setPromptText("Buatkan outline draf khotbah ibadah kategorial pemuda kreatif dengan Nas pembimbing Surat Roma 12:1-2 tentang persembahan diri yang hidup. Tuliskan dalam 3 poin perenungan ringkas beserta contoh nyata kehidupan anak muda di desa.");
    } else if (type === 'warta') {
      setPromptText("Tolong rapikan kalimat acak dari warta jemaat Mere ini: 'Hari selasa ada ibadah ibu-ibu di rayon 1 jam setengah 4 sore di rumah ibu any, hari sabtu pemuda kumpul di gereja jam 5 sore bahas pentakosta, persembahan terkumpul rayon 1 sebesar Rp 1.500.000 untuk diakonia.'");
    } else {
      setPromptText("Tuliskan garis besar outline struktur 5 slide presentasi ibadah kaum bapak bertema 'Kepemimpinan Kasih dalam Rumah Tangga Kristen' dari Efesus 5.");
    }
  };

  const queryGeminiAI = async () => {
    setLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, type: modelType })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAiResponse(data.text);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend unavailable, falling back to local simulation:", err);
    }

    // Client-side simulation fallback when backend is inactive (e.g. Vercel)
    setTimeout(() => {
      let simulatedResponse = "";
      if (modelType === 'khotbah') {
        simulatedResponse = `### DRAF OUTLINE KHOTBAH MINGGUAN (PRESBITER DIGITAL)
**Tema:** Melayani dengan Hati yang Sehati (Getsemani Bersemi)
**Nas Pembimbing:** Filipi 2:1-4 & Roma 12:1-2 (Satu tubuh, persembahan yang hidup)

**I. Pendahuluan**
Syalom bapak, ibu, dan pemuda-pemudi di Getsemani Mere! Panggilan untuk sehati dan sepikir adalah prinsip teologis penting di wilayah Amarasi Barat. Terutama sejalan dengan dorongan pelayanan kontemporer masa kini, bagaimana kita memaknai "${promptText}" dalam panggilan iman?

**II. Pokok-Pokok Pikiran**
1. **Pemberdayaan Karunia Kristen**: Menjunjung tinggi persekutuan yang rukun tanpa membedakan status sosial demi meringankan penderitaan sesama.
2. **Kemandirian Teologi & Pelayanan Aktif**: Setiap talenta jemaat (pemuda, kaum bapak, kaum perempuan) di rayon-rayon siap bersemi menebar damai sejahtera.
3. **Pembaharuan Budi**: Tidak mengikuti trend perpecahan dunia, melainkan memfokuskan pelayanan pada kemuliaan Allah di Amarasi Barat.

**III. Rencana Aksi Nyata (Aplikasi)**
- Rutin mengikuti persiapan pelayan Konsistori pada Jumat malam.
- Menggalakkan gotong royong diakonia kasih Rayon bagi yang berkekurangan.

**IV. Doa & Refleksi Penutup**
"Tuhan, kumpulkan kami dalam sehati melayani, agar Getsemani Mere senantiasa bersemi subur dalam berkat-Mu. Amin."

---
*Catatan: Menggunakan kecerdasan buatan lokal (client-side simulation fallback) karena server Vercel sedang luring.*`;
      } else if (modelType === 'warta') {
        simulatedResponse = `### DRAF SUNTIKAN BERITA WARTA JEMAAT MINGGUAN (PROSES AI)
**Warta Resmi Jemaat GMIT Getsemani Mere - Amarasi Barat**

1. **PERSIDANGAN MAJELIS HARIAN**
   Syalom jemaat terkasih! Menindaklanjuti program pelita informasi gerejawi, draf tentang "${promptText}" akan dikoordinasikan langsung oleh KMJ Pdt. Maria Martha Boesday, S.Th secara transparan.

2. **URUTAN KEGIATAN & PERSIAPAN IBADAH**
   - **Ibadah Rayon I & II**: Diadakan serentak hari Minggu (08:00 WITA).
   - **Persiapan Pelayan**: Jumat malam pukul 19:15 WITA di Gedung Konsistori. 
   - **Ibadah Kategorial**: Ibadah Perempuan (Selasa 15:30 WITA), Ibadah Kaum Bapak (Kamis 18:00 WITA), Ibadah Pemuda (Sabtu 17:00 WITA).

3. **PENDATAAN LAYANAN ADMINISTRASI**
   Bagi keluarga yang telah mendaftarkan baptisan anak atau Sidi secara online, harap memverifikasi berkas fisik ke Sekretaris Majelis Jemaat Pnt. Sarah Leka-Kase.

Sehati bersemi: Bersyukur, Sehati, Melayani!

---
*Catatan: Menggunakan kecerdasan buatan lokal (client-side simulation fallback) karena server Vercel sedang luring.*`;
      } else {
        simulatedResponse = `### ASISTEN PELAYANAN TEOLOGIS GEREJA
Syalom! Draf ide terkait "${promptText}" telah dirumuskan dengan rujukan iman:

**Rekomendasi Struktur Pelayanan:**
1. **Latar Belakang Teologis**: Tekankan visi GMIT Getsemani Mere sebagai jemaat yang mandiri, misioner, inklusif, dan rukun demi kemuliaan Allah.
2. **Konteks Lokal Amarasi Barat**: Hubungkan ajaran firman dengan contoh keseharian seperti toleransi antar-rayon, kesederhanaan hidup, serta kemandirian teologi, daya, dan dana.
3. **Pesan Penutup**: Sapaan perpisahan pastoral yang menyejukkan hati.

---
*Catatan: Menggunakan kecerdasan buatan lokal (client-side simulation fallback) karena server Vercel sedang luring.*`;
      }
      setAiResponse(simulatedResponse);
      setLoading(false);
    }, 1200);
  };

  const handleCopyToClipboard = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="ai-corner-widget" className="bg-white border-t-2 border-b-2 border-gmit-gold/25 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title widget representing AI Corner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center space-x-2 bg-gmit-gold/10 text-gmit-gold-dark text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest leading-none border border-gmit-gold/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Inovasi Pelayanan Digital Gereja</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gmit-blue-deep tracking-tight">
              AI CORNER: ASISTEN TEOLOGIS PRESBITER
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
              Panduan mingguan bagi para pendeta, penatua, diaken, dan pengurus UPP jemaat Getsemani Mere untuk memanfaatkan kecerdasan buatan demi menyusun publikasi warta berkualitas & bahan pengajaran firman.
            </p>
          </div>

          {/* Quick tips links */}
          <div className="flex bg-slate-100 p-1.5 rounded-lg border border-slate-200 self-start md:self-center">
            <button
              onClick={() => { setActiveTip('khotbah'); handleApplyTemplate('khotbah'); }}
              className={`px-3 py-1.5 text-xs font-bold rounded font-display flex items-center space-x-1.5 transition-all ${
                activeTip === 'khotbah' ? 'bg-white text-gmit-blue shadow-sm border border-gray-200' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Outline Khotbah</span>
            </button>
            <button
              onClick={() => { setActiveTip('warta'); handleApplyTemplate('warta'); }}
              className={`px-3 py-1.5 text-xs font-bold rounded font-display flex items-center space-x-1.5 transition-all ${
                activeTip === 'warta' ? 'bg-white text-gmit-blue shadow-sm border border-gray-200' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Draf Warta</span>
            </button>
            <button
              onClick={() => { setActiveTip('pemuda'); handleApplyTemplate('pemuda'); }}
              className={`px-3 py-1.5 text-xs font-bold rounded font-display flex items-center space-x-1.5 transition-all ${
                activeTip === 'pemuda' ? 'bg-white text-gmit-blue shadow-sm border border-gray-200' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Presentation className="h-3.5 w-3.5" />
              <span>Slide Presentasi</span>
            </button>
          </div>
        </div>

        {/* Content panel split: Steps & live simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Steps and Template Copier - lg:5 */}
          <div className="lg:col-span-5 bg-gmit-gold-light/40 border border-gmit-gold/15 rounded-xl p-6 flex flex-col justify-between">
            <div className="space-y-5 text-left">
              <h3 className="font-display font-bold text-lg text-gmit-blue-deep flex items-center space-x-2">
                <Brain className="h-5 w-5 text-gmit-gold" />
                <span>Tips Mingguan: {aiTips[activeTip].title}</span>
              </h3>

              <div className="bg-white/80 border border-gmit-gold/10 p-4 rounded-lg">
                <span className="text-[10px] font-mono font-bold text-gmit-gold uppercase tracking-widest block">Rekomendasi AI</span>
                <span className="text-sm font-semibold text-gmit-blue-deep block mt-0.5">
                  Gunakan {aiTips[activeTip].aiChoice}
                </span>
              </div>

              {/* Step checklist */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Langkah Operasional:</h4>
                <ol className="space-y-3">
                  {aiTips[activeTip].steps.map((step, idx) => (
                    <li key={idx} className="flex text-xs text-slate-700 leading-relaxed font-normal">
                      <span className="bg-gmit-gold/20 text-gmit-gold-dark font-extrabold h-4.5 w-4.5 rounded-full flex items-center justify-center mr-2.5 flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Prompt template copy button */}
            <div className="mt-8 border-t border-gmit-gold/10 pt-5 text-left space-y-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Template Perintah Prompt Resmi:</span>
              <p className="bg-white border rounded p-3 text-xs text-slate-600 italic leading-relaxed line-clamp-3">
                &ldquo;{aiTips[activeTip].promptTemplate}&rdquo;
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(aiTips[activeTip].promptTemplate);
                  alert('Template perintah berhasil disalin! Anda dapat menempelkannya di ChatGPT / Copilot milik Anda.');
                }}
                className="w-full py-2 bg-gmit-gold/15 hover:bg-gmit-gold/25 border border-gmit-gold/25 text-gmit-gold-dark font-semibold font-display rounded transition-all text-xs uppercase"
              >
                Salin Template Perintah
              </button>
            </div>
          </div>

          {/* Interactive Live AI Composer Sandbox - lg:7 */}
          <div className="lg:col-span-7 bg-white border border-gray-100 rounded-xl shadow p-6 flex flex-col space-y-5">
            <div className="text-left space-y-1">
              <span className="text-xs font-bold uppercase text-gmit-blue tracking-widest flex items-center space-x-1">
                <span className="h-1.5 w-1.5 bg-gmit-blue rounded-full animate-pulse"></span>
                <span>Playground AI</span>
              </span>
              <h3 className="font-display font-bold text-lg text-gmit-blue-deep">Interaksi Teologis Geminî AI</h3>
              <p className="text-xs text-slate-400">Pilih menu di atas atau ketik naskah khusus Anda secara bebas di bawah untuk berkonsultasi langsung.</p>
            </div>

            {/* Prompt textarea inputs */}
            <div className="space-y-4">
              <textarea
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Ketik draf, ide firman, atau catatan pengumuman di sini..."
                className="w-full text-sm border border-gray-100 rounded-lg p-3 bg-slate-50/70 focus:bg-white focus:ring-1 focus:ring-gmit-gold outline-none resize-none leading-relaxed"
              />

              <button
                onClick={queryGeminiAI}
                disabled={loading || !promptText.trim()}
                className="w-full py-3 bg-gmit-blue-deep hover:bg-gmit-blue text-white font-bold font-display tracking-widest uppercase rounded shadow transition flex items-center justify-center space-x-2 text-xs disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Gemini Sedang Merumuskan Pelayanan...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 text-gmit-gold" />
                    <span>DRAFT DETAIAL PELAYANAN SEKARANG</span>
                  </>
                )}
              </button>
            </div>

            {/* Response Section */}
            {(aiResponse || loading) && (
              <div className="bg-slate-50 border rounded-lg p-5 text-left space-y-3 overflow-hidden flex-1 flex flex-col justify-between min-h-[180px]">
                <div className="flex items-center justify-between border-b border-gray-250 pb-2">
                  <span className="text-xs font-bold uppercase text-gmit-blue-deep font-display tracking-widest">
                    HASIL KERANGKA PELAYANAN:
                  </span>
                  {aiResponse && (
                    <button
                      onClick={handleCopyToClipboard}
                      className="text-gmit-blue hover:text-gmit-gold transition flex items-center space-x-1.5 text-xs font-semibold"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600">Terbaca Salin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Salin Hasil</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="py-8 space-y-4 flex flex-col items-center justify-center text-center">
                    <div className="h-10 w-10 border-4 border-gmit-gold border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-gray-500 italic">Gemini sedang menelaah ayat teologi & merancang outline pelayanan Gereja Mere...</p>
                  </div>
                ) : (
                  <div className="text-xs md:text-sm text-slate-700 leading-relaxed overflow-y-auto whitespace-pre-wrap font-sans max-h-[250px] scrollbar-thin">
                    {aiResponse}
                  </div>
                )}
              </div>
            )}

            {/* Quick Warning */}
            <div className="text-[10px] text-gray-400 leading-tight text-center italic">
              *Teknologi AI Corner diintegrasikan secara penuh ke server menggunakan Google Gemini SDK. Gunakan hasil rancangan secara arif untuk menunjang warta jemaat.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
